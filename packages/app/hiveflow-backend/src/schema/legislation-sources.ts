// ── Legislation Source abstraction ──────────────────────────────
// Factory pattern for different legislation bodies.
// Add new sources by implementing LegislationSource and registering
// in getLegislationSource().

export interface LegislationSource {
  /** Human-readable name, e.g. "NZ Legislation" */
  readonly name: string;

  /** Does this source handle the given URL? */
  matches(url: string): boolean;

  /** Convert a web-page URL to the downloadable PDF URL, or null if N/A */
  getPdfUrl(url: string): string | null;

  /** Return the versions API URL, or null if N/A */
  getVersionsUrl(url: string): string | null;

  /** Extract text from a fetched buffer. Default: tries pdf-parse then
   *  falls back to HTML tag-stripping. Override for custom parsing. */
  extractText(buffer: Buffer, contentType: string): Promise<string>;
}

// ── Default helpers ────────────────────────────────────────────

export function pdfToMarkdown(rawText: string): string {
  const lines = rawText.split('\n').map(l => l.trim());
  let md = '';

  // ── Find the title ──────────────────────────────────────────
  const verIdx = lines.findIndex(l => /^Version as at$/i.test(l));
  if (verIdx >= 2) {
    const titleLine1 = lines[verIdx - 2]?.trim();
    const titleLine2 = lines[verIdx - 1]?.trim();
    if (titleLine1 && titleLine1.length > 5) {
      const title = titleLine2 && titleLine2.length > 3 && !/^\d+$/.test(titleLine2)
        ? `${titleLine1} ${titleLine2}`
        : titleLine1;
      md += `# ${title}\n\n`;
    }
  }

  // ── Find start of content (skip TOC) ────────────────────────
  let contentStart = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^Part\s+\d+$/i.test(lines[i])) {
      contentStart = i;
      break;
    }
  }

  // ── Convert content ─────────────────────────────────────────
  for (let i = contentStart; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Skip bare page numbers
    if (/^\d{1,3}$/.test(line)) continue;

    // Part headings: "Part 1", "Part 2", etc.
    if (/^Part\s+\d+$/i.test(line)) {
      md += `## ${line}\n\n`;
      continue;
    }

    // Numbered sections with trailing page number: "1.1 Title 49"
    const sectionMatch = line.match(/^(\d+\.\d+[A-Za-z]?)\s+(.+?)\s+\d{1,3}$/);
    if (sectionMatch) {
      md += `### ${sectionMatch[1]} ${sectionMatch[2]}\n\n`;
      continue;
    }

    // Numbered sections without page number (but not ending in comma/semicolon — those continue)
    const sectionNoPage = line.match(/^(\d+\.\d+[A-Za-z]?)\s+(.+)/);
    if (sectionNoPage && !/[,;]$/.test(line) && !/^\d+$/.test(sectionNoPage[2])) {
      md += `### ${sectionNoPage[1]} ${sectionNoPage[2]}\n\n`;
      continue;
    }

    // Short standalone line that follows a heading — likely a sub-heading
    // Disabled: too many false positives. Numbered sections provide enough structure.
    // if (prevWasHeading && line.length < 60 && ...
    //   md += `### ${line}\n\n`;
    //   continue;
    // }

    // Regular paragraph
    md += `${line}\n\n`;
  }

  return md;
}

async function defaultExtractText(buffer: Buffer, contentType: string): Promise<string> {
  // Detect PDF by magic bytes (some servers misreport content-type)
  const isPdf = contentType.includes('pdf') ||
    (buffer.length > 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46);

  if (isPdf) {
    try {
      const { PDFParse } = require('pdf-parse');
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      return pdfToMarkdown(result.text);
    } catch (err: any) {
      console.warn('PDF extraction failed:', err.message);
      return '_PDF text extraction failed. Use "Refresh" to retry._';
    }
  }

  // HTML → strip tags
  const html = buffer.toString('utf-8');
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.slice(0, 10000);
}

// ── HTML → Markdown ─────────────────────────────────────────

/** Convert legislation HTML to markdown, preserving heading structure. */
export function htmlToMarkdown(html: string): string {
  // Extract main content — legislation.govt.nz wraps content in specific containers
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
    || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
    || html.match(/<div[^>]*id="content"[^>]*>([\s\S]*?)<\/div>/i);
  const content = mainMatch ? mainMatch[1] : html;

  let md = content
    // Headings
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, text) => `# ${text.trim()}\n\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => `## ${text.trim()}\n\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, text) => `### ${text.trim()}\n\n`)
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, text) => `#### ${text.trim()}\n\n`)
    // Paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, text) => `${text.trim()}\n\n`)
    // List items
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => `- ${text.trim()}\n`)
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, ' ')
    // Decode entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/^[ \t]+/gm, '')     // strip leading whitespace from each line
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return md;
}

// ── XML Parser ──────────────────────────────────────────────
// legislation.govt.nz provides structured XML at
// /act/public/{year}/{number}/en/latest.xml with full
// part → subpart → provision → subprov hierarchy.

/** Internal node types from the XML tree */
type XmlNode =
  | { kind: 'part'; label: string; heading: string; children: XmlNode[] }
  | { kind: 'subpart'; label: string; heading: string; children: XmlNode[] }
  | { kind: 'prov'; id: string; label: string; heading: string; body: SubProv[] }
  | { kind: 'crosshead'; heading: string };

interface SubProv {
  label: string;       // "1", "a", "i", or "" for unlabelled
  text: string;         // plain text content
  isCrosshead?: boolean; // subprov.crosshead element
  children: SubProv[];  // nested label-para
}

/** Resolve a legislation.govt.nz page URL to the XML data URL.
 *  Act:        …/act/public/2015/70/en/latest/          → …/latest.xml
 *  Secondary:  …/secondary-legislation/pco-drafted/2017/131/en/latest/  → …/latest.xml
 *  Old act:    …/act/public/2015/0070/latest/whole.html  → …/act/public/2015/70/en/latest.xml */
function resolveNzXmlUrl(url: string): string | null {
  // Already an XML URL
  if (url.endsWith('.xml')) return url;

  // Strip fragment and trailing slash
  const cleanUrl = url.replace(/#.*$/, '').replace(/\/$/, '');

  // Modern URLs ending with /latest → append .xml
  if (cleanUrl.endsWith('/latest')) {
    const xmlUrl = cleanUrl + '.xml';
    console.log(`[legislation-sources] resolveNzXmlUrl: ${url} → ${xmlUrl}`);
    return xmlUrl;
  }

  // Old-style URLs: /act/public/{year}/{number}/
  const m = cleanUrl.match(/act\/public\/(\d{4})\/(\d+)/);
  if (m) {
    const year = m[1];
    const number = parseInt(m[2], 10).toString(); // strip leading zeros
    const xmlUrl = `https://legislation.govt.nz/act/public/${year}/${number}/en/latest.xml`;
    console.log(`[legislation-sources] resolveNzXmlUrl: ${url} → ${xmlUrl}`);
    return xmlUrl;
  }

  console.log(`[legislation-sources] resolveNzXmlUrl: could not resolve XML for ${url}`);
  return null;
}

/** Walk xml-js compact-mode DOM, collecting plain text with basic
 *  structural formatting: line breaks between definition items and
 *  label-paragraphs, proper (a)/(b)/(i) labels.
 *  def-term elements are placed before their surrounding text
 *  so definitions read as "term means definition" not "means definition term". */
function xmlTextContent(el: any): string {
  if (typeof el === 'string') return el;
  if (!el) return '';

  if (Array.isArray(el)) return el.map(xmlTextContent).join(' ');

  const skipTags = new Set(['notes', 'history', 'history-note', 'editorial-note',
    'cf', 'reprint.note', 'reprint.index', 'reprint.notes', 'reprint.amend',
    'end', 'end.reprint-note', 'cover', 'cover.reprint-note', 'contents', 'toc',
    'front', 'enactment', 'long-title', 'schedule', 'schedule.amendments',
    'schedule.group', 'schedule.amendments.group1', 'schedule.amendments.group2',
    'legtable', 'table', 'example', 'toc-item', 'heading', 'label',
    'pursuant', 'made', 'gg', 'cover.reprint-note', 'reprint-date',
    'admin-office', 'ministry', 'commencement', 'insertwords', 'struckoutwords']);

  // Extract def-term first — it's the head of a definition and should appear
  // before any surrounding text (e.g. "above ground stationary container means...")
  let defTerms = '';
  const defTermChildren = el['def-term'];
  if (defTermChildren) {
    const items = Array.isArray(defTermChildren) ? defTermChildren : [defTermChildren];
    defTerms = items.map((d: any) => (d._text || '').toString().trim()).filter(Boolean).join(' ');
  }

  let text = '';
  const ownText = el._text ? el._text.toString().trim() : '';
  if (defTerms) {
    // If there's ownText AND it starts with the def-term text (xml-js
    // duplicates _text from child into parent), skip the duplicate
    if (ownText && ownText.startsWith(defTerms)) {
      text = ownText; // def-term text is already in _text
    } else {
      text = defTerms + (ownText ? ' ' + ownText : '');
    }
  } else {
    text = ownText;
  }

  // Collect remaining children (skip _-prefixed, skipTags, and already-handled def-term)
  const childKeys = Object.keys(el).filter(k =>
    !k.startsWith('_') && !skipTags.has(k) && k !== 'def-term');

  for (const key of childKeys) {
    const child = el[key];
    const items = Array.isArray(child) ? child : [child];

    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      const inner = xmlTextContent(item);
      if (!inner) continue;

      if (key === 'def-para') {
        text += (text ? '\n' : '') + inner;
      } else if (key === 'label-para') {
        const lbl = (item.label?._text || '').toString().trim();
        const prefix = lbl ? `\n(${lbl}) ` : '\n';
        text += prefix + inner;
      } else if (key === 'para' && text) {
        text += '\n' + inner;
      } else {
        text += (text ? ' ' : '') + inner;
      }
    }
  }

  return text.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();
}

/** Parse a <prov> element into a Provision node. */
function parseProv(el: any): XmlNode {
  const id = el._attributes?.id || '';
  const label = (el.label?._text || '').toString().trim();
  const heading = (el.heading?._text || '').toString().trim();
  const body = parseProvBody(el['prov.body']);
  return { kind: 'prov', id, label, heading, body };
}

/** Parse <prov.body> into SubProv array (compact mode). */
function parseProvBody(el: any): SubProv[] {
  if (!el) return [];
  const items: SubProv[] = [];

  for (const key of Object.keys(el)) {
    if (key.startsWith('_')) continue;
    const val = el[key];
    const arr = Array.isArray(val) ? val : [val];

    for (const child of arr) {
      if (!child || typeof child !== 'object') continue;
      const tag = key;

      if (tag === 'subprov') {
        items.push(parseSubProv(child));
      } else if (tag === 'subprov.crosshead') {
        items.push({
          label: '',
          text: (child._text || '').toString().trim(),
          isCrosshead: true,
          children: [],
        });
      }
    }
  }

  return items;
}

/** Parse a <subprov> element (compact mode). */
function parseSubProv(el: any): SubProv {
  const label = (el.label?._text || '').toString().trim();
  const children: SubProv[] = [];
  let text = '';

  for (const key of Object.keys(el)) {
    if (key.startsWith('_')) continue;
    const val = el[key];
    const arr = Array.isArray(val) ? val : [val];

    for (const child of arr) {
      if (!child || typeof child !== 'object') continue;
      const tag = key;

      if (tag === 'para') {
        text += (text ? ' ' : '') + xmlTextContent(child);
      } else if (tag === 'label-para') {
        const lpLabel = (child.label?._text || '').toString().trim();
        let lpText = '';
        for (const lk of Object.keys(child)) {
          if (lk.startsWith('_') || lk === 'label') continue;
          const lv = child[lk];
          const larr = Array.isArray(lv) ? lv : [lv];
          for (const lc of larr) {
            if (!lc || typeof lc !== 'object') continue;
            if (lk === 'para') {
              lpText += (lpText ? ' ' : '') + xmlTextContent(lc);
            } else if (lk === 'label-para') {
              const nlLabel = (lc.label?._text || '').toString().trim();
              let nlText = '';
              for (const nk of Object.keys(lc)) {
                if (nk.startsWith('_') || nk === 'label') continue;
                const nv = lc[nk];
                const narr = Array.isArray(nv) ? nv : [nv];
                for (const nc of narr) {
                  if (nk === 'para') nlText += (nlText ? ' ' : '') + xmlTextContent(nc);
                }
              }
              children.push({ label: nlLabel, text: nlText.trim(), children: [] });
            }
          }
        }
        children.push({ label: lpLabel, text: lpText.trim(), children: [] });
      }
    }
  }

  return { label, text: text.trim(), children };
}

/** Parse the XML string into a flat-structured act with nested children. */
function parseLegislationXmlNodes(xml: string): { title: string; nodes: XmlNode[] } {
  // Use a lightweight XML parser — xml-js is commonly available,
  // otherwise fall back to regex-based extraction
  let parsed: any;
  try {
    const xmlJs = require('xml-js');
    parsed = xmlJs.xml2js(xml, { compact: true, ignoreComment: true, ignoreDoctype: true });
  } catch {
    // Fall back: simple regex extraction (handles the common case)
    return parseLegislationXmlRegex(xml);
  }

  const root = parsed?.regulation || parsed?.act || parsed?.bill;
  if (!root) throw new Error('No <regulation> or <act> root element in XML');

  const title = root.cover?.title?._text || root.cover?.title || 'Untitled';
  const body = root.body;
  if (!body) return { title, nodes: [] };

  // body contains <part>, <prov>, <crosshead> directly
  const bodyChildren = body['$$'] || [];
  const nodes = parseBodyChildren(bodyChildren);

  return { title, nodes };
}

function parseBodyChildren(container: any): XmlNode[] {
  if (!container) return [];
  const nodes: XmlNode[] = [];

  // Compact mode: iterate properties (skip _text, _attributes)
  for (const key of Object.keys(container)) {
    if (key.startsWith('_')) continue;
    const val = container[key];
    const items = Array.isArray(val) ? val : [val];

    for (const child of items) {
      if (!child || typeof child !== 'object') continue;
      const tag = key; // property name IS the tag in compact mode

      switch (tag) {
        case 'part': {
          const label = (child.label?._text || '').toString().trim();
          const heading = (child.heading?._text || '').toString().trim();
          nodes.push({ kind: 'part', label, heading, children: parseBodyChildren(child) });
          break;
        }
        case 'subpart': {
          const label = (child.label?._text || '').toString().trim();
          const heading = (child.heading?._text || '').toString().trim();
          nodes.push({ kind: 'subpart', label, heading, children: parseBodyChildren(child) });
          break;
        }
        case 'prov': {
          nodes.push(parseProv(child));
          break;
        }
        case 'crosshead': {
          const heading = (child._text || '').toString().trim();
          nodes.push({ kind: 'crosshead', heading });
          break;
        }
      }
    }
  }

  return nodes;
}

/** Regex-based fallback parser — extracts section structure from
  * XML text when xml-js is not available. Less precise but functional. */
function parseLegislationXmlRegex(xml: string): { title: string; nodes: XmlNode[] } {
  const titleMatch = xml.match(/<title[^>]*>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'Untitled';

  const nodes: XmlNode[] = [];

  // Extract <part> blocks
  const partRe = /<part[^>]*>[\s\S]*?<\/part>/g;
  let partMatch;
  while ((partMatch = partRe.exec(xml)) !== null) {
    const partXml = partMatch[0];
    const labelMatch = partXml.match(/<label[^>]*>([^<]*)<\/label>/);
    const headingMatch = partXml.match(/<heading[^>]*>([^<]*)<\/heading>/);

    const children = parsePartContentRegex(partXml);
    nodes.push({
      kind: 'part',
      label: labelMatch ? labelMatch[1] : '',
      heading: headingMatch ? headingMatch[1] : '',
      children,
    });
  }

  return { title, nodes };
}

function parsePartContentRegex(partXml: string): XmlNode[] {
  const nodes: XmlNode[] = [];

  // Extract <subpart> and <prov> and <crosshead>
  const subpartRe = /<subpart[^>]*>[\s\S]*?<\/subpart>/g;
  let spMatch;
  while ((spMatch = subpartRe.exec(partXml)) !== null) {
    const spXml = spMatch[0];
    const labelMatch = spXml.match(/<label[^>]*>([^<]*)<\/label>/);
    const headingMatch = spXml.match(/<heading[^>]*>([^<]*)<\/heading>/);
    nodes.push({
      kind: 'subpart',
      label: labelMatch ? labelMatch[1] : '',
      heading: headingMatch ? headingMatch[1] : '',
      children: parseProvsRegex(spXml),
    });
  }

  // Also find top-level provs and crossheads (not inside subparts)
  // Remove subpart blocks first
  const withoutSubparts = partXml.replace(/<subpart[^>]*>[\s\S]*?<\/subpart>/g, '');
  for (const node of parseProvsRegex(withoutSubparts)) {
    nodes.push(node);
  }

  return nodes;
}

function parseProvsRegex(xml: string): XmlNode[] {
  const nodes: XmlNode[] = [];

  const provRe = /<prov[^>]*>[\s\S]*?<\/prov>/g;
  let pMatch;
  while ((pMatch = provRe.exec(xml)) !== null) {
    const pXml = pMatch[0];
    const idMatch = pXml.match(/id="([^"]+)"/);
    const labelMatch = pXml.match(/<label[^>]*>([^<]*)<\/label>/);
    const headingMatch = pXml.match(/<heading[^>]*>([^<]*)<\/heading>/);
    const bodyMatch = pXml.match(/<prov\.body>[\s\S]*?<\/prov\.body>/);

    const body: SubProv[] = [];
    if (bodyMatch) {
      body.push(...parseSubProvsRegex(bodyMatch[0]));
    }

    nodes.push({
      kind: 'prov',
      id: idMatch ? idMatch[1] : '',
      label: labelMatch ? labelMatch[1] : '',
      heading: headingMatch ? headingMatch[1] : '',
      body,
    });
  }

  // Crossheads
  const chRe = /<crosshead[^>]*>([^<]*)<\/crosshead>/g;
  let chMatch;
  while ((chMatch = chRe.exec(xml)) !== null) {
    nodes.push({ kind: 'crosshead', heading: chMatch[1] });
  }

  return nodes;
}

function parseSubProvsRegex(provBodyXml: string): SubProv[] {
  const items: SubProv[] = [];

  const spRe = /<subprov[^>]*>[\s\S]*?<\/subprov>/g;
  let spMatch;
  while ((spMatch = spRe.exec(provBodyXml)) !== null) {
    const spXml = spMatch[0];
    const labelMatch = spXml.match(/<label[^>]*>([^<]*)<\/label>/);
    const textMatch = spXml.match(/<para[^>]*>[\s\S]*?<\/para>/);
    const text = textMatch ? stripXmlTags(textMatch[0]) : '';

    // label-para children
    const children: SubProv[] = [];
    const lpRe = /<label-para[^>]*>[\s\S]*?<\/label-para>/g;
    let lpMatch;
    while ((lpMatch = lpRe.exec(spXml)) !== null) {
      const lpXml = lpMatch[0];
      const lpLabelMatch = lpXml.match(/<label[^>]*>([^<]*)<\/label>/);
      const lpTextMatch = lpXml.match(/<para[^>]*>[\s\S]*?<\/para>/);
      children.push({
        label: lpLabelMatch ? lpLabelMatch[1] : '',
        text: lpTextMatch ? stripXmlTags(lpTextMatch[0]) : '',
        children: [],
      });
    }

    items.push({
      label: labelMatch ? labelMatch[1] : '',
      text: text.trim(),
      children,
    });
  }

  return items;
}

function stripXmlTags(xml: string): string {
  return xml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Structured Act → Markdown ──────────────────────────────

/** Convert parsed XML nodes to markdown with clean heading hierarchy.
 *  # Act title
 *  ## Part 1 Heading
 *  ### Subpart 1—Heading
 *  #### 36 Primary duty of care
 *  (1) Text...
 *  (a) sub-item... */
export function structuredActToMarkdown(title: string, nodes: XmlNode[]): string {
  let md = `# ${title}\n\n`;

  function walk(ns: XmlNode[], depth: number) {
    for (const node of ns) {
      switch (node.kind) {
        case 'part': {
          const prefix = node.label ? `Part ${node.label}` : '';
          const h = [prefix, node.heading].filter(Boolean).join(' ');
          md += `${'#'.repeat(depth + 1)} ${h}\n\n`;
          walk(node.children, depth + 1);
          break;
        }
        case 'subpart': {
          const prefix = node.label ? `Subpart ${node.label}—` : '';
          md += `${'#'.repeat(depth + 1)} ${prefix}${node.heading}\n\n`;
          walk(node.children, depth + 1);
          break;
        }
        case 'prov': {
          const h = node.label ? `${node.label} ${node.heading}` : node.heading;
          md += `${'#'.repeat(depth + 1)} ${h}\n\n`;
          renderSubProvs(node.body);
          md += '\n';
          break;
        }
        case 'crosshead': {
          md += `${'#'.repeat(depth + 1)} ${node.heading}\n\n`;
          break;
        }
      }
    }
  }

  function renderSubProvs(items: SubProv[]) {
    for (const sp of items) {
      if (sp.isCrosshead) {
        md += `**${sp.text}**\n\n`;
        continue;
      }
      const label = sp.label ? `(${sp.label})` : '';
      const content = [label, sp.text].filter(Boolean).join(' ');
      if (content) md += `${content}\n`;
      for (const lp of sp.children) {
        const lpLabel = lp.label ? `(${lp.label})` : '';
        const lpContent = [lpLabel, lp.text].filter(Boolean).join(' ');
        if (lpContent) md += `${lpContent}\n`;
      }
      if (content) md += '\n';
    }
  }

  walk(nodes, 0);
  return md.trim();
}

/** Parse legislation.govt.nz XML into structured markdown. */
export function parseLegislationXml(xml: string): string {
  const { title, nodes } = parseLegislationXmlNodes(xml);
  return structuredActToMarkdown(title, nodes);
}

/** Extract all provisions (sections/clauses) and structural headings
 *  from legislation XML. Uses xml-js for proper DOM traversal — handles
 *  nested part → subpart → prov hierarchies in acts and flat prov/crosshead
 *  structures in regulations. Returns a flat list for collapsible card rendering.
 *  Works across all NZ legislation types (acts, regulations, bills). */
export function extractProvisions(xml: string): Array<{
  kind: 'part' | 'subpart' | 'crosshead' | 'prov';
  sectionRef: string;
  title: string;
  dlmId: string;
  heading: string;
  text: string;
}> {
  const provisions: Array<{
    kind: 'part' | 'subpart' | 'crosshead' | 'prov';
    sectionRef: string;
    title: string;
    dlmId: string;
    heading: string;
    text: string;
  }> = [];

  let parsed: any;
  try {
    const xmlJs = require('xml-js');
    parsed = xmlJs.xml2js(xml, { compact: true, ignoreComment: true, ignoreDoctype: true });
  } catch {
    return provisions;
  }

  const root = parsed?.regulation || parsed?.act || parsed?.bill || parsed;
  const body = root?.body;
  if (!body) return provisions;

  const headingStack: string[] = [];

  function walk(container: any) {
    if (!container) return;
    const children: any[] = [];
    for (const key of Object.keys(container)) {
      if (key.startsWith('_')) continue;
      const val = container[key];
      if (Array.isArray(val)) {
        for (const item of val) children.push({ '#name': key, ...item });
      } else if (val && typeof val === 'object') {
        children.push({ '#name': key, ...val });
      }
    }

    for (const child of children) {
      const tag = child['#name'];
      const rawLabel = child.label;
      const rawHeading = child.heading;
      const label = typeof rawLabel === 'string' ? rawLabel.trim()
        : (rawLabel?._text || '').toString().trim();
      const heading = typeof rawHeading === 'string' ? rawHeading.trim()
        : (rawHeading?._text || '').toString().trim();
      const id = child._attributes?.id || '';

      switch (tag) {
        case 'part': {
          headingStack.length = 0;
          headingStack.push(`Part ${label} ${heading}`.trim());
          provisions.push({ kind: 'part', sectionRef: label, title: heading, dlmId: '', heading: '', text: '' });
          walk(child);
          break;
        }
        case 'subpart': {
          while (headingStack.length > 1 && headingStack[headingStack.length - 1].startsWith('Subpart')) {
            headingStack.pop();
          }
          headingStack.push(`Subpart ${label}—${heading}`.trim());
          provisions.push({ kind: 'subpart', sectionRef: label, title: heading, dlmId: '', heading: '', text: '' });
          walk(child);
          break;
        }
        case 'crosshead': {
          // Crosshead text is in _text, not in a <heading> child
          const crossTitle = heading || (child._text || '').toString().trim();
          while (headingStack.length > 1 && !headingStack[headingStack.length - 1].match(/^(Part |Subpart )/)) {
            headingStack.pop();
          }
          headingStack.push(crossTitle);
          provisions.push({ kind: 'crosshead', sectionRef: '', title: crossTitle, dlmId: '', heading: '', text: '' });
          break;
        }
        case 'prov': {
          const provBody = child['prov.body'];
          const bodyText = provBody ? xmlTextContent(provBody) : '';
          provisions.push({
            kind: 'prov',
            sectionRef: label,
            title: heading,
            dlmId: id,
            heading: headingStack.join(' → '),
            text: bodyText,
          });
          break;
        }
      }
    }
  }

  walk(body);
  return provisions;
}

// ── NZ Legislation ─────────────────────────────────────────────

async function nzExtractText(buffer: Buffer, contentType: string): Promise<string> {
  // Try XML first — if the buffer contains XML, parse it structurally
  const text = buffer.toString('utf-8');
  if (text.trimStart().startsWith('<?xml') || text.trimStart().startsWith('<act') || text.trimStart().startsWith('<regulation')) {
    try {
      const md = parseLegislationXml(text);
      if (md.length > 500) return md;
    } catch (err: any) {
      console.warn('XML parsing failed, falling back to HTML:', err.message);
    }
  }

  // NZ legislation HTML has proper heading structure — use it
  if (contentType.includes('html') || contentType.includes('text')) {
    const md = htmlToMarkdown(text);
    if (md.length > 500) return md; // got real content
  }
  // Fall back to PDF extraction
  return defaultExtractText(buffer, contentType);
}

const nzSource: LegislationSource = {
  name: 'NZ Legislation',

  matches(url: string): boolean {
    return url.includes('legislation.govt.nz');
  },

  getPdfUrl(url: string): string | null {
    if (url.endsWith('.pdf')) return url;
    return null;
  },

  getVersionsUrl(url: string): string | null {
    return null;
  },

  extractText: nzExtractText,
};

// ── Raw / fallback ─────────────────────────────────────────────

const rawSource: LegislationSource = {
  name: 'Raw',

  matches(_url: string): boolean {
    return true; // catch-all
  },

  getPdfUrl(url: string): string | null {
    // If the URL already ends in .pdf, use it as-is
    return url.endsWith('.pdf') ? url : null;
  },

  getVersionsUrl(_url: string): string | null {
    return null;
  },

  extractText: defaultExtractText,
};

// ── Registry ───────────────────────────────────────────────────

const sources: LegislationSource[] = [
  nzSource,
  // Add more sources here, e.g.:
  // eurLexSource,
  // usCongressSource,
  // austliiSource,
  rawSource, // keep last as catch-all
];

/** Return the first source that matches the URL. */
export function getLegislationSource(url: string): LegislationSource {
  for (const source of sources) {
    if (source.matches(url)) return source;
  }
  return rawSource;
}

// ── Convenience ────────────────────────────────────────────────

export interface FetchedDocument {
  /** The actual URL that was fetched (may differ from input if redirected to PDF) */
  fetchedUrl: string;
  /** Extracted text content (markdown for PDFs, stripped text for HTML) */
  text: string;
  /** The raw XML source if fetched from a legislation XML API.
   *  Preserves DLM IDs, cross-references, and structured hierarchy
   *  that markdown conversion loses. Send this to AI when available. */
  rawXml?: string;
  /** The PDF URL (if the source can compute one) */
  pdfUrl: string | null;
  /** The versions API URL (if the source supports it) */
  versionsUrl: string | null;
  /** The source that handled this URL */
  sourceName: string;
}

/** Discover the latest PDF URL by scraping the versions page
 *  for dated links like …/en/2025-07-01.pdf. */
async function discoverLatestPdfUrl(versionsUrl: string): Promise<string | null> {
  try {
    const vResp = await fetch(versionsUrl);
    if (!vResp.ok) return null;
    const html = await vResp.text();
    const dates: string[] = [];
    const re = /\/(\d{4}-\d{2}-\d{2})\.pdf/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      if (!dates.includes(m[1])) dates.push(m[1]);
    }
    if (dates.length === 0) return null;

    // Latest date (YYYY-MM-DD sorts lexicographically)
    dates.sort();
    const latest = dates[dates.length - 1];

    // Build the PDF URL from the versions page URL:
    // New style: …/en/latest/?active_tab=version → …/en/2025-07-01.pdf
    // Old style: …/latest/?active_tab=version   → …/latest/2025-07-01.pdf
    const baseUrl = versionsUrl.replace(/(\/(?:en\/)?)latest\/.*$/, '$1');
    return baseUrl + latest + '.pdf';
  } catch {
    return null;
  }
}

/** Fetch a legislation URL and extract text using the appropriate source. */
export async function fetchDocument(url: string): Promise<FetchedDocument> {
  const source = getLegislationSource(url);
  const versionsUrl = source.getVersionsUrl(url);

  // ── Phase 1: discover the latest PDF URL ──────────────────
  let pdfUrl = source.getPdfUrl(url);
  if (!pdfUrl && versionsUrl) {
    pdfUrl = await discoverLatestPdfUrl(versionsUrl);
  }

  // ── Phase 1.5: NZ legislation — use XML directly ──────────
  // legislation.govt.nz provides structured XML at /en/latest.xml
  // with full part → subpart → provision hierarchy.
  if (source.name === 'NZ Legislation') {
    const xmlUrl = resolveNzXmlUrl(url);
    if (xmlUrl) {
      try {
        console.log(`[legislation-sources] fetchDocument: fetching XML ${xmlUrl}`);
        const xmlResp = await fetch(xmlUrl);
        if (xmlResp.ok) {
          const xml = await xmlResp.text();
          const md = parseLegislationXml(xml);
          if (md.length > 500) {
            // Extract "as at" date from XML for the PDF URL
            const dateMatch = xml.match(/date\.as\.at="([^"]+)"/);
            const imprMatch = xml.match(/year\.imprint="([^"]+)"/);
            if (dateMatch || imprMatch) {
              const [y, m, d] = (dateMatch?.[1] || imprMatch?.[1] || '').split('-');
              if (y && m) {
                const baseUrl = url.replace(/(\/en\/)?latest\/.*$/, '/en/');
                pdfUrl = baseUrl + `${y}-${m}-${d || '01'}.pdf`;
              }
            }
            return {
              fetchedUrl: xmlUrl,
              text: md,
              rawXml: xml,
              pdfUrl,
              versionsUrl,
              sourceName: source.name,
            };
          }
        }
      } catch (err: any) {
        console.warn('NZ legislation XML fetch failed, falling back:', err.message);
      }
    }

    // Fall back: try HTML if XML failed or URL couldn't be resolved
    try {
      console.log(`[legislation-sources] fetchDocument: falling back to HTML ${url}`);
      const htmlResp = await fetch(url);
      if (htmlResp.ok) {
        const html = await htmlResp.text();
        const md = htmlToMarkdown(html);
        if (md.length > 500) {
          const dateMatch = html.match(/as at (\d{1,2})\s+(\w+)\s+(\d{4})/i);
          if (dateMatch) {
            const months: Record<string, string> = {
              january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',
              july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'
            };
            const day = dateMatch[1].padStart(2, '0');
            const month = months[dateMatch[2].toLowerCase()];
            const year = dateMatch[3];
            if (month) {
              const baseUrl = url.replace(/(\/en\/)latest\/.*$/, '$1');
              pdfUrl = baseUrl + `${year}-${month}-${day}.pdf`;
            }
          }
          return {
            fetchedUrl: url,
            text: md,
            pdfUrl,
            versionsUrl,
            sourceName: source.name,
          };
        }
      }
    } catch (err: any) {
      console.warn('NZ legislation HTML fetch failed, falling back:', err.message);
    }
  }

  // ── Phase 2: fetch the PDF (or raw URL as fallback) ───────
  let fetchUrl = pdfUrl || url;
  let resolvedPdfUrl = pdfUrl;

  // Fetch with manual redirect handling — some legislation servers
  // (e.g. legislation.govt.nz) set auth cookies on 302 that the
  // final PDF endpoint requires, and Node.js fetch drops them.
  console.log(`[legislation-sources] fetchDocument: fetching PDF ${fetchUrl}`);
  let response = await fetch(fetchUrl, { redirect: 'manual' });

  // Follow up to 3 redirects, preserving cookies
  for (let i = 0; i < 3; i++) {
    if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
      const location = response.headers.get('location');
      if (!location) break;
      const nextUrl = new URL(location, fetchUrl).toString();
      const setCookie = response.headers.get('set-cookie');

      const headers: Record<string, string> = {};
      if (setCookie) headers['Cookie'] = setCookie.split(';')[0]; // take just the key=value

      fetchUrl = nextUrl;
      if (!resolvedPdfUrl) resolvedPdfUrl = nextUrl;
      response = await fetch(nextUrl, { headers: Object.keys(headers).length > 0 ? headers : undefined });
    } else {
      break;
    }
  }

  if (!response.ok) throw new Error(`Failed to fetch ${fetchUrl}: HTTP ${response.status}`);

  const contentType = response.headers.get('content-type') || '';
  const buffer = Buffer.from(await response.arrayBuffer());
  const text = await source.extractText(buffer, contentType);

  return {
    fetchedUrl: fetchUrl,
    text,
    pdfUrl: resolvedPdfUrl,
    versionsUrl,
    sourceName: source.name,
  };
}

/** Fetch version history from the source's versions API. */
export async function fetchVersions(
  url: string,
): Promise<Array<{ version: number; title: string; date: string }>> {
  const source = getLegislationSource(url);
  const versionsUrl = source.getVersionsUrl(url);

  // NZ legislation: extract "as at" date from XML if available,
  // otherwise fall back to scraping the HTML page.
  if (!versionsUrl && source.name === 'NZ Legislation') {
    const xmlUrl = resolveNzXmlUrl(url);
    if (xmlUrl) {
      try {
        console.log(`[legislation-sources] fetchVersions: fetching XML ${xmlUrl}`);
        const xmlResp = await fetch(xmlUrl);
        if (xmlResp.ok) {
          const xml = await xmlResp.text();
          const dateMatch = xml.match(/date\.as\.at="([^"]+)"/);
          if (dateMatch) {
            return [{
              version: 1,
              title: `Version as at ${dateMatch[1]}`,
              date: dateMatch[1],
            }];
          }
        }
      } catch {
        // fall through
      }
    }
    // Fall back to HTML scraping
    try {
      console.log(`[legislation-sources] fetchVersions: falling back to HTML ${url}`);
      const htmlResp = await fetch(url);
      if (htmlResp.ok) {
        const html = await htmlResp.text();
        const dateMatch = html.match(/as at (\d{1,2})\s+(\w+)\s+(\d{4})/i);
        if (dateMatch) {
          return [{
            version: 1,
            title: `Version as at ${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}`,
            date: dateMatch[0],
          }];
        }
      }
    } catch {
      // fall through
    }
    return [];
  }

  if (!versionsUrl) return [];

  const response = await fetch(versionsUrl);
  if (!response.ok) throw new Error(`Failed to fetch versions: HTTP ${response.status}`);

  const contentType = response.headers.get('content-type') || '';
  const html = await response.text();

  // If the source returns JSON, parse it directly
  if (contentType.includes('json')) {
    const data = JSON.parse(html);
    return (data.versions || []).map((v: any) => ({
      version: v.version || 0,
      title: v.title || '',
      date: v.date || '',
    }));
  }

  // HTML page — scrape dated PDF links like …/en/2025-07-01.pdf
  const versions: Array<{ version: number; title: string; date: string }> = [];
  const linkRegex = /\/(\d{4}-\d{2}-\d{2})\.pdf/gi;
  const datesSeen = new Set<string>();
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const date = match[1];
    if (datesSeen.has(date)) continue;
    datesSeen.add(date);
    versions.push({
      version: versions.length + 1,
      title: `Version as at ${date}`,
      date,
    });
  }

  return versions;
}
