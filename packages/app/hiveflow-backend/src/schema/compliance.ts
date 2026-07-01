import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";
import * as fs from "fs";
import * as path from "path";
import { fetchDocument, fetchVersions, extractProvisions } from "./legislation-sources";

const UPLOAD_DIR = process.env.COMPLIANCE_UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'compliance');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── AI helpers ───────────────────────────────────────────────

interface OpenRouterResult {
  content: string;
  finishReason: string | null;
}

const AI_MODEL_DEFAULT = 'deepseek/deepseek-v4-pro';
const AI_MODEL_FAST = 'deepseek/deepseek-v4-flash'; // faster & cheaper for extraction

async function callOpenRouter(prompt: string, model: string = AI_MODEL_DEFAULT): Promise<OpenRouterResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.BACKEND_URL || 'http://localhost:9011',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      reasoning_effort: 'low',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const choice = data?.choices?.[0];
  return {
    content: choice?.message?.content || '',
    finishReason: choice?.finish_reason || null,
  };
}

/** Generate a plain-English explanation and real-world example for a
 *  legislative provision. Used by the "Explain This" button in review mode. */
async function explainProvision(
  sectionRef: string,
  title: string,
  text: string,
  heading?: string,
): Promise<{ explanation: string; example: string }> {
  const context = heading ? ` (found in ${heading})` : '';
  const prompt = `You are an expert in New Zealand health and safety legislation, helping a business understand their compliance obligations for ISO certification.

Explain the following legislative provision in plain English. Give a short explanation (2-3 sentences) of what it requires, then a concrete real-world example of what a business would need to do to comply.

Provision: ${sectionRef} - ${title}${context}
Full text:
${text}

Respond with a JSON object with two fields:
- "explanation": plain-English explanation (2-3 sentences)
- "example": a concrete real-world example showing what a business must do

Keep both fields concise — under 150 words each. Use NZ English spelling.`;

  const result = await callOpenRouter(prompt, AI_MODEL_FAST);
  try {
    const cleaned = result.content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      explanation: parsed.explanation || result.content,
      example: parsed.example || '',
    };
  } catch {
    return { explanation: result.content, example: '' };
  }
}

export function extractJsonArray(content: string): any[] {
  // Strip markdown code fences if present
  let cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Try non-greedy: match the first complete JSON array
  let jsonMatch = cleaned.match(/\[[\s\S]*?\]/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch {}
  }

  // Try greedy: match the last complete JSON array (handles nested brackets)
  jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch {}
  }

  // Last resort: response was truncated (no closing ]). Try to repair.
  const partialMatch = cleaned.match(/\[[\s\S]*/);
  if (partialMatch) {
    const partial = partialMatch[0];

    // Strategy: find the last complete item by locating the last ",
    // This handles truncation like: ["s.1", "s.2", "s.3  (cut mid-string)
    // It keeps everything up to and including the last ", and appends ]
    const lastCompleteComma = partial.lastIndexOf('",');
    if (lastCompleteComma > 1) {
      const repaired = partial.slice(0, lastCompleteComma + 1) + ']';
      try { return JSON.parse(repaired); } catch {}
    }

    // Try last " alone (single item, no comma): ["s.1"  →  ["s.1"]
    const lastCompleteQuote = partial.lastIndexOf('"');
    if (lastCompleteQuote > 1 && partial[lastCompleteQuote - 1] !== '\\') {
      const repaired = partial.slice(0, lastCompleteQuote + 1) + ']';
      try { return JSON.parse(repaired); } catch {}
    }

    // For object arrays: find last }
    const lastBrace = partial.lastIndexOf('}');
    if (lastBrace > 1) {
      const repaired = partial.slice(0, lastBrace + 1) + ']';
      try { return JSON.parse(repaired); } catch {}
    }
  }

  throw new Error(`No JSON array found in AI response (${content.length} chars, starts with: "${content.slice(0, 80)}")`);
}

// ── Outline extraction ───────────────────────────────────────

export interface OutlineEntry {
  level: number;       // 1 = #, 2 = ##, 3 = ###
  heading: string;     // the heading text (without # prefix)
  lineIndex: number;   // line number in the markdown for text extraction
  children: OutlineEntry[];
}

/** Patterns that indicate administrative/amendment noise, not compliance sections */
export const NOISE_PATTERNS = [
  // Legislative amendment notes
  /\badded, on\b/i,
  /\brepealed\b/i,
  /\bamended\s+by\b/i,
  /\binserted, on\b/i,
  /\bomitted, on\b/i,
  /\bItem\s+\d+:/i,
  /^Schedule\s+\d+\s+item\s+\d+/i,
  /\bamendment(s)?\s+incorporated\b/i,

  // PDF extraction junk: number tables and reference fragments
  /^\d{1,3}(,\d{3})*\s+\d[\d.]*\s+\d+$/,           // "100,000 1.5 1" (table row)
  /^[\d.,]+\s+[\d.,]+\s+[\d.,]+$/,                    // "10,000,000 14 10" (table row)
  /^[\d.]+[A-Z]?,\s*[\d.]+[A-Z]?\s*$/,               // "4.1.2A, 4.1.2B" (reference fragment)
  /^[a-z]+\s+\d+\.\d+[A-Z]?,\s*[—–-]?\s*$/i,           // "regulation 19.7,—" (fragmented reference)
  /^[\d.]+[A-Z]?$/,                                    // bare "19.7" or "4.1.2A" (fragment)
  /^\$\s*[\d,]+$/,                                     // "$ 100,000" (dollar amounts)
  /^\d+\s*%$/,                                         // "50%" (bare percentage)
  /^\(\d+\)\s*$/,                                      // "(1)" bare subsection number
  /^[a-z]\)\s*$/,                                      // "a)" bare sub-subsection
];

export function isHeadingNoise(heading: string): boolean {
  // Very long headings are almost always amendment notes or verbose descriptions
  if (heading.length > 100) return true;

  // Bare numbers, dollar amounts, percentages aren't headings
  if (/^[\d.,$%\s]+$/.test(heading)) return true;

  // Single character or just a number reference
  if (heading.length < 3 && !/[A-Za-z]{2,}/.test(heading)) return true;

  // Must contain at least 3 consecutive letters (filters garbled PDF text like "D, PC D, PC")
  if (!/[A-Za-z]{3,}/.test(heading)) return true;

  return NOISE_PATTERNS.some(p => p.test(heading));
}

/**
 * Parse markdown into a hierarchical outline of headings.
 * Only captures #, ##, ### (first three levels).
 * Returns a flat list with children nested for structure.
 */
export function extractOutline(markdown: string): OutlineEntry[] {
  const lines = markdown.split('\n');
  const root: OutlineEntry[] = [];
  const stack: { level: number; children: OutlineEntry[] }[] = [{ level: 0, children: root }];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (!match) continue;

    const level = match[1].length;
    const heading = match[2].trim();
    const entry: OutlineEntry = { level, heading, lineIndex: i, children: [] };

    // Pop stack until we find the parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(entry);
    stack.push({ level, children: entry.children });
  }

  return root;
}

/** Render outline using markdown heading markers (# ## ###) instead of breadcrumbs */
export function formatOutline(outline: OutlineEntry[], prefix: string = ''): string {
  const lines: string[] = [];
  for (const entry of outline) {
    if (isHeadingNoise(entry.heading)) continue;

    const marker = '#'.repeat(Math.min(entry.level, 6));
    lines.push(`${marker} ${entry.heading}`);

    // Recurse into children (limited to level < 3 for AI-friendliness)
    if (entry.level < 3) {
      const childText = formatOutline(entry.children, prefix);
      if (childText) lines.push(childText);
    }
  }
  return lines.join('\n');
}

// ── XML-aware extraction helpers ──────────────────────────────

/** Extract an outline from legislation XML — returns the structural
 *  skeleton without body text: Part → Subpart → Provision headings.
 *  Preserves DLM IDs as comments for precise AI referencing. */
function extractXmlOutline(xml: string): string {
  const lines: string[] = [];
  
  // Match part/subpart/prov/crosshead structure, collecting labels and headings
  const tagRe = /<(part|subpart|crosshead|prov)\b[^>]*>/g;
  let m;
  while ((m = tagRe.exec(xml)) !== null) {
    const tag = m[1];
    const fullTag = m[0];
    
    // Extract id attribute for prov elements
    const idMatch = fullTag.match(/id="([^"]+)"/);
    const id = idMatch ? ` <!-- ${idMatch[1]} -->` : '';
    
    // Extract label and heading from the element's children
    // Read forward from this position to find <label> and <heading>
    const afterTag = xml.slice(m.index + fullTag.length);
    const labelMatch = afterTag.match(/<label[^>]*>([^<]*)<\/label>/);
    const headingMatch = afterTag.match(/<heading[^>]*>([^<]*)<\/heading>/);
    
    const label = labelMatch ? labelMatch[1].trim() : '';
    const heading = headingMatch ? headingMatch[1].trim() : '';
    
    switch (tag) {
      case 'part':
        lines.push(`## Part ${label} ${heading}`.trim() + id);
        break;
      case 'subpart':
        lines.push(`### Subpart ${label}—${heading}`.trim() + id);
        break;
      case 'prov':
        lines.push(`#### ${label} ${heading}`.trim() + id);
        break;
      case 'crosshead':
        lines.push(`#### ${heading}`.trim() + id);
        break;
    }
  }
  
  return lines.join('\n');
}

/** Extract a single <prov> element from XML matching a section reference.
 *  The ref could be a section number ("36"), a heading text, or both.
 *  Returns the raw XML of the matching <prov> for AI consumption. */
function extractXmlSection(xml: string, ref: string): string | null {
  // Normalize ref: strip markdown heading markers, trim
  const cleanRef = ref.replace(/^#+\s*/, '').toLowerCase().trim();
  
  // Find all <prov> elements
  const provRe = /<prov\b[^>]*>[\s\S]*?<\/prov>/g;
  let m;
  while ((m = provRe.exec(xml)) !== null) {
    const provXml = m[0];
    
    // Extract label and heading
    const labelMatch = provXml.match(/<label[^>]*>([^<]*)<\/label>/);
    const headingMatch = provXml.match(/<heading[^>]*>([^<]*)<\/heading>/);
    
    const label = labelMatch ? labelMatch[1].trim() : '';
    const heading = headingMatch ? headingMatch[1].trim() : '';
    
    // Try exact match: "36 primary duty of care"
    const fullHeading = `${label} ${heading}`.toLowerCase().trim();
    if (fullHeading === cleanRef || fullHeading.includes(cleanRef) || cleanRef.includes(fullHeading)) {
      return provXml;
    }
    
    // Try label-only match: "36"
    if (label && cleanRef === label) {
      return provXml;
    }
    
    // Try heading-only fuzzy match (at least 10 chars shared)
    if (heading && heading.length >= 10) {
      const hLower = heading.toLowerCase();
      if (hLower.includes(cleanRef) || cleanRef.includes(hLower)) {
        return provXml;
      }
    }
  }
  
  return null;
}

// ── Two-phase breakout inference ──────────────────────────────

interface BreakoutItem {
  sectionRef: string;
  title: string;
  summary: string;
}

/**
 * Phase 1: Send just the outline to the AI to identify which sections
 * are compliance-relevant. Returns only section references — fast & cheap.
 */
async function identifyRelevantSections(outline: string): Promise<string[]> {
  const prompt = `You are a compliance expert. Below is the table of contents of a piece of legislation.

Identify EVERY section or clause that creates a compliance obligation for a workplace.
Consider: health & safety, privacy, employment, environmental, record-keeping, reporting, penalties, duties, training, inspections, notifications, etc.

CRITICAL: You MUST copy section references EXACTLY as they appear in the outline below.
Do NOT paraphrase, rewrite, or combine heading text. Pick the complete heading text verbatim.
Each item in your response must be a line-for-line copy from the outline.

Example: if the outline contains "### 1.1 Application to Defence Force", return "1.1 Application to Defence Force".
Do NOT return "s 1.1" or "section 1.1 defence force" — copy the exact text.

If a Part heading contains relevant sub-sections, include the Part heading too (copied verbatim).
Skip purely procedural/administrative sections.

Return ONLY a JSON array of the copied heading texts, no other text:
["exact heading 1", "exact heading 2"]

Outline:
${outline}`;

  const { content, finishReason } = await callOpenRouter(prompt, AI_MODEL_FAST);

  // Empty response: retry once (transient API error)
  if (!content || content.trim().length === 0) {
    console.warn(`⚠️ identifyRelevantSections received empty response (finish_reason=${finishReason}) — retrying once...`);
    const retry = await callOpenRouter(prompt, AI_MODEL_FAST);
    if (retry.content && retry.content.trim().length > 0) {
      try { return extractJsonArray(retry.content); } catch {}
    }
    // Still empty — fall back to ## headings only (not all 873)
    console.warn(`⚠️ Retry also failed. Falling back to Part-level (##) headings only.`);
    const lines = outline.split('\n');
    return lines.filter(l => l.startsWith('## ')).map(l => l.replace(/^##\s+/, '').trim());
  }

  if (finishReason === 'length') {
    console.warn(`⚠️ identifyRelevantSections truncated (finish_reason=length) — response may be incomplete. Consider reducing outline size.`);
  }
  try {
    const refs: string[] = extractJsonArray(content);
    if (refs.length === 0) {
      console.warn(`⚠️ identifyRelevantSections returned empty array from ${outline.split('\n').length}-line outline.`);
      return [];
    }
    console.log(`🎯 Phase 1 AI: ${refs.length} compliance-relevant sections identified from ${outline.split('\n').length} outline headings`);
    return refs;
  } catch (err: any) {
    console.warn(`⚠️ Failed to parse identifyRelevantSections response (${err.message}), falling back to Part-level (##) headings only.`);
    const lines = outline.split('\n');
    return lines.filter(l => l.startsWith('## ')).map(l => l.replace(/^##\s+/, '').trim());
  }
}

/**
 * Extract the full text of a specific section from the markdown.
 * Finds the heading matching `sectionRef` and returns text from that heading
 * to the next heading of the same or higher level.
 */
export function extractSectionText(markdown: string, sectionRef: string, allOutlines: OutlineEntry[]): string | null {
  const lines = markdown.split('\n');

  // Flatten the outline to find the matching entry and its level
  function flatten(outline: OutlineEntry[]): OutlineEntry[] {
    const result: OutlineEntry[] = [];
    for (const e of outline) {
      result.push(e);
      result.push(...flatten(e.children));
    }
    return result;
  }

  const flat = flatten(allOutlines);

  // Try exact match first (AI returns exact heading text from the outline)
  const refLower = sectionRef.toLowerCase().replace(/^#+\s*/, '').trim();
  let entry = flat.find(e => e.heading.toLowerCase().trim() === refLower);

  // Fall back to fuzzy substring match only if exact fails
  if (!entry) {
    entry = flat.find(e => {
      const hLower = e.heading.toLowerCase().trim();
      // Only match if the heading and ref share a meaningful substring (at least 10 chars or a number)
      const common = hLower.includes(refLower) ? refLower : (refLower.includes(hLower) ? hLower : '');
      return common.length >= 10 || /\d/.test(common);
    });
  }

  if (!entry) return null;

  // Find the next heading of same or higher level
  let endLine = lines.length;
  for (const e of flat) {
    if (e.lineIndex > entry.lineIndex && e.level <= entry.level) {
      endLine = e.lineIndex;
      break;
    }
  }

  return lines.slice(entry.lineIndex, endLine).join('\n').trim();
}

/**
 * Phase 2: Send batched section texts to AI for breakout extraction.
 * Groups multiple sections into each call to minimize API round-trips.
 */
async function inferBreakoutsBatch(
  sections: Array<{ ref: string; text: string }>,
  batchIndex: number,
  totalBatches: number
): Promise<BreakoutItem[]> {
  const sectionsBlock = sections.map(s =>
    `### ${s.ref}\n${s.text.slice(0, 6000)}`
  ).join('\n\n---\n\n');

  const prompt = `You are a compliance expert. Below are several sections from legislation (batch ${batchIndex + 1}/${totalBatches}).
For EACH section below, extract the compliance obligation it creates for a workplace.

Provide for each section:
1. sectionRef — the exact section reference
2. title — a short title summarizing the requirement
3. summary — a 1-2 sentence plain-language summary of what this section requires in practice

If a section does NOT create a meaningful compliance obligation, skip it.

Return ONLY a JSON array, no other text:
[{"sectionRef": "...", "title": "...", "summary": "..."}]

Sections:
${sectionsBlock}`;

  const { content } = await callOpenRouter(prompt, AI_MODEL_FAST);
  try {
    return extractJsonArray(content);
  } catch (err: any) {
    console.warn(`⚠️ Failed to parse batch ${batchIndex + 1}/${totalBatches} response: ${err.message} (${sections.length} sections, ${sectionsBlock.length.toLocaleString()} chars input)`);
    return [];
  }
}

/**
 * Two-phase breakout inference:
 * 1. Extract outline → AI identifies compliance-relevant sections (1 call)
 * 2. Feed relevant sections' full text in batches → AI extracts all breakouts
 *
 * deepseek-v4-flash has a 1M token context window — the outline always fits.
 */
async function inferBreakoutPoints(markdown: string, xml?: string): Promise<BreakoutItem[]> {
  // When XML is available, extract outline and section text from the
  // structured XML tree instead of regex-parsing markdown. This preserves
  // DLM IDs for precise section referencing and cross-references.
  
  // Phase 1: Extract outline and identify relevant sections
  let outlineText: string;
  let sections: Array<{ ref: string; text: string }> = [];
  
  if (xml) {
    // ── XML path: use structured XML directly, skip markdown regex ──
    // Phase 1: Build outline from XML structure tags (no body text)
    const xmlOutline = extractXmlOutline(xml);
    outlineText = xmlOutline;
    const outlineLines = xmlOutline.split('\n').filter(Boolean).length;
    console.log(`📋 Extracted XML outline: ${outlineLines} headings, ${xmlOutline.length.toLocaleString()} chars`);

    const relevantRefs = await identifyRelevantSections(outlineText);
    if (relevantRefs.length === 0) {
      console.warn(`⚠️ identifyRelevantSections returned 0 results from XML outline — falling back to markdown`);
      // Fall through to markdown path below
    } else {
      const uniqueRefs = [...new Set(relevantRefs.map(r => r.toLowerCase().trim()))];
      console.log(`🔍 XML Phase 1: ${relevantRefs.length} candidate refs → ${uniqueRefs.length} unique`);

      // Phase 2: Extract <prov> XML elements matching the identified refs
      const seenTexts = new Set<string>();
      let missedRefs = 0;
      let duplicateTexts = 0;

      for (const ref of uniqueRefs) {
        const provXml = extractXmlSection(xml, ref);
        if (!provXml) { missedRefs++; continue; }
        const textKey = provXml.slice(0, 200);
        if (seenTexts.has(textKey)) { duplicateTexts++; continue; }
        seenTexts.add(textKey);
        sections.push({ ref, text: provXml });
      }
      if (missedRefs > 0) {
        console.warn(`⚠️ Could not extract XML for ${missedRefs}/${uniqueRefs.length} section refs`);
      }
      if (sections.length === 0) {
        console.warn(`⚠️ XML Phase 2 failed — falling back to markdown`);
        sections = []; // reset for fallback
      }
    }
  }
  
  if (sections.length === 0) {
    // ── Markdown path (fallback or primary if no XML) ──
    const outline = extractOutline(markdown);
    outlineText = formatOutline(outline);
    const outlineHeadings = outlineText.split('\n').length;
    console.log(`📋 Extracted outline: ${outlineHeadings} headings, ${outlineText.length.toLocaleString()} chars (~${Math.ceil(outlineText.length / 4).toLocaleString()} tokens)`);

    const relevantRefs = await identifyRelevantSections(outlineText);
    if (relevantRefs.length === 0) {
      console.warn(`⚠️ identifyRelevantSections returned 0 results from ${outlineHeadings} outline headings — no compliance sections found.`);
      return [];
    }

    const uniqueRefs = [...new Set(relevantRefs.map(r => r.toLowerCase().trim()))];
    console.log(`🔍 Phase 1 complete: ${relevantRefs.length} candidate refs → ${uniqueRefs.length} unique after ref dedup`);

    const seenTexts = new Set<string>();
    let missedRefs = 0;
    let duplicateTexts = 0;

    for (const ref of uniqueRefs) {
      const text = extractSectionText(markdown, ref, outline);
      if (!text) { missedRefs++; continue; }
      const textKey = text.slice(0, 200);
      if (seenTexts.has(textKey)) { duplicateTexts++; continue; }
      seenTexts.add(textKey);
      sections.push({ ref, text });
    }
    if (missedRefs > 0) {
      console.warn(`⚠️ Could not extract text for ${missedRefs}/${uniqueRefs.length} section refs (ref may not match markdown headings)`);
    }
    if (duplicateTexts > 0) {
      console.log(`🔧 Removed ${duplicateTexts} duplicate section texts (different refs → same content)`);
    }

    if (sections.length === 0) {
      console.warn(`⚠️ Phase 2 aborted: could not extract text for any of the ${uniqueRefs.length} identified section refs.`);
      return [];
    }
  }

  // Phase 2: Batch sections into ~16K char groups, process in parallel
  const BATCH_CHARS = 16000;
  const batches: Array<Array<{ ref: string; text: string }>> = [];
  let currentBatch: Array<{ ref: string; text: string }> = [];
  let currentChars = 0;

  for (const section of sections) {
    const sectionChars = section.text.length + section.ref.length + 50; // overhead
    if (currentChars + sectionChars > BATCH_CHARS && currentBatch.length > 0) {
      batches.push(currentBatch);
      currentBatch = [];
      currentChars = 0;
    }
    currentBatch.push(section);
    currentChars += sectionChars;
  }
  if (currentBatch.length > 0) batches.push(currentBatch);

  const CONCURRENCY = 5;
  const totalSectionChars = sections.reduce((sum, s) => sum + s.text.length, 0);
  console.log(`📦 Phase 2: ${sections.length} sections (${totalSectionChars.toLocaleString()} chars total) → ${batches.length} batches (${CONCURRENCY} concurrent)`);

  // Process batches in parallel
  const results: BreakoutItem[] = [];

  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const batchSlice = batches.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batchSlice.map((batch, j) => inferBreakoutsBatch(batch, i + j, batches.length))
    );
    results.push(...batchResults.flat());
  }

  const hitRate = sections.length > 0 ? Math.round(results.length / sections.length * 100) : 0;
  console.log(`✅ Complete: ${sections.length} sections → ${results.length} breakouts (${hitRate}% hit rate, ${batches.length} AI calls)`);
  return results;
}

// ── Regulation metadata inference ─────────────────────────────

async function inferRegulationMeta(text: string, xml?: string): Promise<{title: string, description: string, type: string, category: string}> {
  // When XML is available, send it directly — preserves DLM IDs,
  // cross-references, and structured hierarchy that markdown loses.
  const body = xml
    ? `You are a compliance expert. Given the XML of a piece of legislation or regulation, infer the following metadata.

The XML preserves the full legal structure including cross-references (intref/extref), defined terms, and DLM IDs. Use this rich structure for accurate inference.

Return ONLY a JSON object, no other text:
{
  "title": "official title of the legislation",
  "description": "1-2 sentence plain-language summary of what this legislation covers",
  "type": "act|regulation|code|standard",
  "category": "Health & Safety|Environmental|Privacy & Data|Employment|Financial|Building & Construction|Transport|Energy"
}

Legislation XML:
${xml.slice(0, 12000)}`
    : `You are a compliance expert. Given the text of a piece of legislation or regulation, infer the following metadata.

Return ONLY a JSON object, no other text:
{
  "title": "official title of the legislation",
  "description": "1-2 sentence plain-language summary of what this legislation covers",
  "type": "act|regulation|code|standard",
  "category": "Health & Safety|Environmental|Privacy & Data|Employment|Financial|Building & Construction|Transport|Energy"
}

Legislation text:
${text.slice(0, 6000)}`;

  const { content } = await callOpenRouter(body);
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON object found in model response');
  return JSON.parse(jsonMatch[0]);
}

// ── Schema ────────────────────────────────────────────────────

export default (prisma: PrismaClient) => {

    const typeDefs = `
    
        type Query {
            complianceRegulations: [Regulation]
            complianceRegulation(id: ID!): Regulation
        }

        type Mutation {
            inferRegulation(source: String!, title: String): Regulation
            createRegulation(title: String!, source: String!, type: String!, category: String!, description: String): Regulation
            updateRegulation(id: ID!, title: String, description: String, source: String, type: String, category: String, isoClause: String, status: String, linkStatus: String, lastVerifiedAt: DateTime): Regulation
            deleteRegulation(id: ID!): ID
            cacheRegulationPdf(id: ID!, url: String!): CachedRegulation
            generateBreakoutPoints(id: ID!): [BreakoutPoint]
            acknowledgeBreakout(id: ID!, understanding: String!, userName: String!): BreakoutPoint
            fetchRegulationVersions(id: ID!, source: String!): [RegulationVersion]
            explainProvision(sectionRef: String!, title: String!, text: String!, heading: String): ProvisionExplanation
        }

        type CachedRegulation {
            pdfUrl: String
            markdown: String
        }

        type Regulation {
            id: ID!
            title: String
            description: String
            type: String
            source: String
            category: String
            isoClause: String
            status: String
            linkStatus: String
            storedHash: String
            storedPdf: String
            storedMarkdown: String
            lastVerifiedAt: DateTime
            currentVersion: Int
            versions: [RegulationVersion]
            breakouts: [BreakoutPoint]
            provisions: [Provision]
            proofs: [ProofEntry]
            createdAt: DateTime
            updatedAt: DateTime
        }

        type RegulationVersion {
            id: ID!
            regulationId: ID!
            version: Int
            changes: String
            file: String
            createdAt: DateTime
        }

        type BreakoutPoint {
            id: ID!
            regulationId: ID!
            sectionRef: String
            title: String
            summary: String
            pageRef: Int
            markdownSnippet: String
            understanding: String
            reviewedBy: String
            reviewedAt: DateTime
        }

        type Provision {
            kind: String!
            sectionRef: String!
            title: String!
            dlmId: String!
            heading: String
            text: String
        }

        type ProvisionExplanation {
            explanation: String!
            example: String
        }

        type ProofEntry {
            id: ID!
            regulationId: ID!
            userName: String
            action: String
            timestamp: DateTime
        }
    `

    const resolvers = {
        Regulation: {
            provisions: async (parent: any) => {
                // Read provisions from saved XML file on disk
                const xmlFiles = fs.readdirSync(UPLOAD_DIR)
                    .filter(f => f.startsWith(parent.id) && f.endsWith('.xml'))
                    .sort()
                    .reverse();
                
                if (xmlFiles.length === 0) return [];
                
                const xmlPath = path.join(UPLOAD_DIR, xmlFiles[0]);
                const xml = fs.readFileSync(xmlPath, 'utf-8');
                
                return extractProvisions(xml);
            }
        },
        Query: {
            complianceRegulations: async (root: any, args: any, context: any) => {
                const org = context?.jwt?.organisation;
                return prisma.regulation.findMany({
                    where: org ? { organisation: org } : {},
                    include: {
                        versions: { orderBy: { version: 'desc' } },
                        breakouts: true,
                        proofs: { orderBy: { timestamp: 'desc' } },
                    },
                    orderBy: { updatedAt: 'desc' },
                });
            },
            complianceRegulation: async (root: any, args: { id: string }, context: any) => {
                return prisma.regulation.findUnique({
                    where: { id: args.id },
                    include: {
                        versions: { orderBy: { version: 'desc' } },
                        breakouts: true,
                        proofs: { orderBy: { timestamp: 'desc' } },
                    },
                });
            }
        },
        Mutation: {
            // ── AI-powered creation from a URL ─────────────────
            inferRegulation: async (root: any, args: { source: string, title?: string }, context: any) => {
                const { source, title: hintTitle } = args;
                const org = context?.jwt?.organisation || 'default';

                // 1. Fetch and extract text using the appropriate source
                const doc = await fetchDocument(source);
                const text = doc.text;

                // 2. Ask AI to infer metadata — pass raw XML when available
                //    so the AI gets DLM IDs, cross-references, and full structure
                let inferred: { title: string, description: string, type: string, category: string };
                try {
                    inferred = await inferRegulationMeta(text, doc.rawXml);
                } catch (err: any) {
                    console.warn('AI inference failed, using fallback:', err.message);
                    inferred = {
                        title: hintTitle || source.split('/').pop() || 'Untitled Regulation',
                        description: '',
                        type: 'act',
                        category: 'Health & Safety',
                    };
                }

                const id = nanoid();
                const now = new Date();

                const regulation = await prisma.regulation.create({
                    data: {
                        id,
                        title: hintTitle || inferred.title,
                        description: inferred.description,
                        type: inferred.type,
                        source,
                        category: inferred.category,
                        status: 'draft',
                        linkStatus: 'unchecked',
                        storedMarkdown: text.replace(/\x00/g, '').slice(0, 200000),
                        storedPdf: doc.pdfUrl,
                        organisation: org,
                        currentVersion: 1,
                        versions: {
                            create: {
                                id: nanoid(),
                                version: 1,
                                changes: 'Initial creation (AI inferred)',
                                createdAt: now,
                            }
                        }
                    },
                    include: {
                        versions: true,
                        breakouts: true,
                        proofs: true,
                    }
                });

                // Also save raw XML to disk for richer AI inference later
                // (preserves DLM IDs, cross-references, hierarchy)
                if (doc.rawXml) {
                    const xmlPath = path.join(UPLOAD_DIR, `${id}-${Date.now()}.xml`);
                    fs.writeFileSync(xmlPath, doc.rawXml);
                }

                // Auto-fetch version history in the background (don't block)
                fetchVersions(source).then(async (apiVersions) => {
                    if (apiVersions.length > 0) {
                        for (const v of apiVersions) {
                            await prisma.regulationVersion.create({
                                data: {
                                    id: nanoid(),
                                    regulationId: id,
                                    version: v.version,
                                    changes: v.title,
                                    createdAt: v.date ? new Date(v.date) : new Date(),
                                }
                            });
                        }
                        await prisma.regulation.update({
                            where: { id },
                            data: { currentVersion: apiVersions.length },
                        });
                    }
                }).catch((err: any) => {
                    console.warn('Background version fetch failed:', err.message);
                });

                return regulation;
            },

            // ── Manual CRUD ────────────────────────────────────
            createRegulation: async (root: any, args: { title: string, source: string, type: string, category: string, description?: string }, context: any) => {
                const org = context?.jwt?.organisation || 'default';
                const id = nanoid();
                const now = new Date();

                return prisma.regulation.create({
                    data: {
                        id,
                        title: args.title,
                        description: args.description || '',
                        type: args.type,
                        source: args.source,
                        category: args.category,
                        status: 'draft',
                        linkStatus: 'unchecked',
                        organisation: org,
                        currentVersion: 1,
                        versions: {
                            create: {
                                id: nanoid(),
                                version: 1,
                                changes: 'Created',
                                createdAt: now,
                            }
                        }
                    },
                    include: {
                        versions: true,
                        breakouts: true,
                        proofs: true,
                    }
                });
            },

            updateRegulation: async (root: any, args: { id: string, title?: string, description?: string, source?: string, type?: string, category?: string, isoClause?: string, status?: string, linkStatus?: string, lastVerifiedAt?: string }, context: any) => {
                const { id, lastVerifiedAt, ...fields } = args;
                return prisma.regulation.update({
                    where: { id },
                    data: {
                        ...fields,
                        ...(lastVerifiedAt ? { lastVerifiedAt: new Date(lastVerifiedAt) } : {}),
                    },
                    include: {
                        versions: true,
                        breakouts: true,
                        proofs: true,
                    }
                });
            },

            deleteRegulation: async (root: any, args: { id: string }, context: any) => {
                await prisma.regulation.delete({ where: { id: args.id } });
                return args.id;
            },

            // ── PDF caching ────────────────────────────────────
            cacheRegulationPdf: async (root: any, args: { id: string, url: string }, context: any) => {
                const { id, url } = args;
                
                // Use fetchDocument to handle redirects + cookies properly
                const doc = await fetchDocument(url);

                const markdown = doc.text.replace(/\x00/g, ''); // strip null bytes
                
                // Save markdown to disk
                const filename = `${id}-${Date.now()}.md`;
                const mdPath = path.join(UPLOAD_DIR, filename);
                fs.writeFileSync(mdPath, markdown);

                // Also save raw XML for provisions extraction
                if (doc.rawXml) {
                    const xmlPath = path.join(UPLOAD_DIR, `${id}-${Date.now()}.xml`);
                    fs.writeFileSync(xmlPath, doc.rawXml);
                }
                
                const localPdfUrl = doc.pdfUrl;
                
                // Persist to DB
                await prisma.regulation.update({
                    where: { id },
                    data: {
                        storedPdf: localPdfUrl,
                        storedMarkdown: markdown,
                        linkStatus: 'verified',
                        lastVerifiedAt: new Date(),
                    }
                });
                
                return { pdfUrl: localPdfUrl, markdown };
            },

            // ── AI breakout point generation ───────────────────
            generateBreakoutPoints: async (root: any, args: { id: string }, context: any) => {
                const { id } = args;
                
                // Read markdown from DB, but prefer the filesystem copy if it's larger
                const regulation = await prisma.regulation.findUnique({ where: { id } });
                let markdown = regulation?.storedMarkdown || '';

                // Check filesystem for a potentially larger/uncut version
                const files = fs.readdirSync(UPLOAD_DIR)
                    .filter(f => f.startsWith(id) && f.endsWith('.md'))
                    .sort()
                    .reverse();
                
                if (files.length > 0) {
                    const filePath = path.join(UPLOAD_DIR, files[0]);
                    const fileMarkdown = fs.readFileSync(filePath, 'utf-8');
                    // Use whichever is larger (filesystem copy is not truncated)
                    if (fileMarkdown.length > markdown.length) {
                        markdown = fileMarkdown;
                    }
                }

                // Check filesystem for XML (richer than markdown for AI — preserves
                // DLM IDs, cross-references, and structured hierarchy)
                let rawXml: string | undefined;
                const xmlFiles = fs.readdirSync(UPLOAD_DIR)
                    .filter(f => f.startsWith(id) && f.endsWith('.xml'))
                    .sort()
                    .reverse();
                if (xmlFiles.length > 0) {
                    rawXml = fs.readFileSync(path.join(UPLOAD_DIR, xmlFiles[0]), 'utf-8');
                }

                if (!markdown || markdown.startsWith('_PDF text extraction failed')) {
                    throw new Error('No cached legislation text found. Cache the PDF first.');
                }
                
                const breakouts = await inferBreakoutPoints(markdown, rawXml);

                // Helper: extract a markdown snippet around a section reference
                const extractSnippet = (md: string, ref: string): string | null => {
                    const lines = md.split('\n');
                    // Search for the section reference (e.g. "s.36" or "IPP 5")
                    const refPattern = new RegExp(ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                    let startIdx = -1;
                    for (let i = 0; i < lines.length; i++) {
                        if (refPattern.test(lines[i])) {
                            startIdx = i;
                            break;
                        }
                    }
                    if (startIdx === -1) return null;
                    // Grab ~10 lines around the match
                    const begin = Math.max(0, startIdx - 2);
                    const end = Math.min(lines.length, startIdx + 8);
                    return lines.slice(begin, end).join('\n').trim();
                };

                // Delete existing AI-generated breakouts and recreate
                await prisma.breakoutPoint.deleteMany({ where: { regulationId: id } });

                const created: any[] = [];
                for (let i = 0; i < breakouts.length; i++) {
                    const b = breakouts[i];
                    const snippet = extractSnippet(markdown, b.sectionRef);
                    const bp = await prisma.breakoutPoint.create({
                        data: {
                            id: nanoid(),
                            regulationId: id,
                            sectionRef: b.sectionRef,
                            title: b.title,
                            summary: b.summary,
                            markdownSnippet: snippet,
                            understanding: 'pending',
                        }
                    });
                    created.push(bp);
                }

                return created;
            },

            // ── Acknowledge a breakout point ───────────────────
            acknowledgeBreakout: async (root: any, args: { id: string, understanding: string, userName: string }, context: any) => {
                const { id, understanding, userName } = args;

                // Update the breakout point
                const bp = await prisma.breakoutPoint.update({
                    where: { id },
                    data: {
                        understanding,
                        reviewedBy: userName,
                        reviewedAt: new Date(),
                    }
                });

                // Create a proof entry on the parent regulation
                await prisma.proofEntry.create({
                    data: {
                        id: nanoid(),
                        regulationId: bp.regulationId,
                        userName,
                        action: understanding === 'acknowledged' ? 'acknowledged' : 'reviewed',
                    }
                });

                return bp;
            },

            // ── Fetch version history from legislation API ────────
            fetchRegulationVersions: async (root: any, args: { id: string, source: string }, context: any) => {
                const { id, source } = args;

                const versions = await fetchVersions(source);
                if (versions.length === 0) return [];

                // Delete existing API-fetched versions and recreate
                await prisma.regulationVersion.deleteMany({
                    where: { regulationId: id },
                });

                const created: any[] = [];
                for (const v of versions) {
                    const rec = await prisma.regulationVersion.create({
                        data: {
                            id: nanoid(),
                            regulationId: id,
                            version: v.version,
                            changes: v.title,
                            createdAt: v.date ? new Date(v.date) : new Date(),
                        }
                    });
                    created.push(rec);
                }

                // Update currentVersion on the regulation
                await prisma.regulation.update({
                    where: { id },
                    data: { currentVersion: versions.length },
                });

                return created;
            },

            // ── Explain a provision in plain English ──────────────
            explainProvision: async (root: any, args: {
                sectionRef: string;
                title: string;
                text: string;
                heading?: string;
            }) => {
                return await explainProvision(
                    args.sectionRef,
                    args.title,
                    args.text,
                    args.heading,
                );
            }
        }
    };

    return {
        typeDefs,
        resolvers
    }
}
