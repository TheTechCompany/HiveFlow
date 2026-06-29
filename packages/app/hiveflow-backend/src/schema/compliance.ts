import { PrismaClient } from "@prisma/client"
import * as fs from "fs";
import * as path from "path";

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'compliance');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function callOpenRouter(markdown: string): Promise<Array<{sectionRef: string, title: string, summary: string}>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  // Truncate to ~8000 chars (model context budget)
  const truncated = markdown.slice(0, 8000);

  const prompt = `You are a compliance expert analyzing New Zealand legislation.
Given the following legislation text, identify up to 10 key breakout points (sections/clauses) that are important for workplace compliance.

For each breakout point, provide:
1. sectionRef — the section/clause reference (e.g. "s.36" or "IPP 5")
2. title — a short title summarizing the requirement
3. summary — a 1-2 sentence plain-language summary of what the section requires

Return ONLY a JSON array, no other text:
[{"sectionRef": "...", "title": "...", "summary": "..."}]

Legislation text:
${truncated}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.BACKEND_URL || 'http://localhost:9011',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-v4-pro',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array found in model response');
  
  return JSON.parse(jsonMatch[0]);
}

function pdfToMarkdown(rawText: string): string {
  // Basic PDF text → markdown conversion
  const lines = rawText.split('\n').filter(l => l.trim());
  let md = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Heuristic: short uppercase lines are likely titles/headings
    if (trimmed.length < 80 && trimmed === trimmed.toUpperCase() && trimmed.length > 10) {
      md += `## ${trimmed}\n\n`;
    } else if (trimmed.match(/^(Section|Part|Schedule)\s+\d+/i)) {
      md += `### ${trimmed}\n\n`;
    } else if (trimmed.match(/^\(\d+\)/) || trimmed.match(/^[a-z]\)/)) {
      md += `- ${trimmed}\n`;
    } else {
      md += `${trimmed}\n\n`;
    }
  }
  
  return md;
}

export default (prisma: PrismaClient) => {

    const typeDefs = `
    
        type Query {
            complianceRegulations: [Regulation]
        }

        type Mutation {
            cacheRegulationPdf(id: ID!, url: String!): CachedRegulation
            generateBreakoutPoints(id: ID!): [BreakoutPoint]
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
            understanding: String
            reviewedBy: String
            reviewedAt: DateTime
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
        Query: {
            complianceRegulations: async (root: any, args: any, context: any) => {
                return [];
            }
        },
        Mutation: {
            cacheRegulationPdf: async (root: any, args: { id: string, url: string }, context: any) => {
                const { id, url } = args;
                
                // Download PDF from legislation source
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to download PDF: HTTP ${response.status}`);
                }
                
                const buffer = Buffer.from(await response.arrayBuffer());
                const filename = `${id}-${Date.now()}.pdf`;
                const filepath = path.join(UPLOAD_DIR, filename);
                fs.writeFileSync(filepath, buffer);

                // Extract text from PDF and convert to markdown
                let markdown = '';
                try {
                    const { PDFParse } = require('pdf-parse');
                    const parser = new PDFParse({ data: buffer });
                    const result = await parser.getText();
                    markdown = pdfToMarkdown(result.text);
                    
                    // Save markdown alongside PDF
                    const mdPath = filepath.replace('.pdf', '.md');
                    fs.writeFileSync(mdPath, markdown);
                } catch (err: any) {
                    console.warn('PDF text extraction failed:', err.message);
                    markdown = '_PDF text extraction failed. View the PDF directly._';
                }
                
                const pdfUrl = `/uploads/compliance/${filename}`;
                
                return {
                    pdfUrl,
                    markdown
                };
            },
            generateBreakoutPoints: async (root: any, args: { id: string }, context: any) => {
                const { id } = args;
                
                // Find the most recent cached markdown file for this regulation
                const files = fs.readdirSync(UPLOAD_DIR)
                    .filter(f => f.startsWith(id) && f.endsWith('.md'))
                    .sort()
                    .reverse();
                
                if (files.length === 0) {
                    throw new Error('No cached legislation text found. Cache the PDF first.');
                }
                
                const mdPath = path.join(UPLOAD_DIR, files[0]);
                const markdown = fs.readFileSync(mdPath, 'utf-8');
                
                if (!markdown || markdown.startsWith('_PDF text extraction failed')) {
                    throw new Error('Legislation text is empty or extraction failed.');
                }
                
                // Call OpenRouter to generate breakout points
                const breakouts = await callOpenRouter(markdown);
                
                return breakouts.map((b, i) => ({
                    id: `ai-${id}-${i}`,
                    regulationId: id,
                    sectionRef: b.sectionRef,
                    title: b.title,
                    summary: b.summary,
                    understanding: 'pending',
                }));
            }
        }
    };

    return {
        typeDefs,
        resolvers
    }
}
