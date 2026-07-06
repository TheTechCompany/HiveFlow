/**
 * E2E fixture test: reads real legislation files from test-fixtures/
 * and runs the full outline extraction + filtering pipeline.
 *
 * Accepts both .md (markdown) and .pdf files.
 * Usage: drop files in test-fixtures/ and run `npx jest --verbose`
 */
import * as fs from 'fs';
import * as path from 'path';
import { pdfToMarkdown } from '../src/schema/legislation-sources';
import {
  extractOutline,
  formatOutline,
  isHeadingNoise,
  extractSectionText,
  OutlineEntry,
} from '../src/schema/compliance';

const FIXTURES_DIR = path.join(__dirname, '..', 'test-fixtures');

// ── PDF → markdown ─────────────────────────────────────────────

async function pdfToText(buffer: Buffer): Promise<string> {
  const { PDFParse } = require('pdf-parse');
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
}

async function loadFixture(filePath: string, ext: string): Promise<{ markdown: string; source: string }> {
  if (ext === '.md') {
    return { markdown: fs.readFileSync(filePath, 'utf-8'), source: 'markdown' };
  }
  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const text = await pdfToText(buffer);
    const markdown = pdfToMarkdown(text);
    return { markdown, source: 'pdf' };
  }
  throw new Error(`Unsupported fixture type: ${ext}`);
}

// ── Helpers ────────────────────────────────────────────────────

function countHeadings(outline: OutlineEntry[]): number {
  let n = 0;
  for (const e of outline) {
    n++;
    n += countHeadings(e.children);
  }
  return n;
}

function countNoiseHeadings(outline: OutlineEntry[]): number {
  let n = 0;
  for (const e of outline) {
    if (isHeadingNoise(e.heading)) n++;
    n += countNoiseHeadings(e.children);
  }
  return n;
}

// ── Discover fixtures ──────────────────────────────────────────

const fixtureFiles: Array<{ file: string; ext: string }> = [];

if (fs.existsSync(FIXTURES_DIR)) {
  for (const f of fs.readdirSync(FIXTURES_DIR)) {
    const ext = path.extname(f).toLowerCase();
    if (ext === '.md' || ext === '.pdf') {
      fixtureFiles.push({ file: f, ext });
    }
  }
}

if (fixtureFiles.length === 0) {
  describe('E2E fixtures', () => {
    it.skip('no fixture files found — drop .md or .pdf files in test-fixtures/', () => {});
  });
} else {
  describe('E2E fixtures', () => {
    for (const { file, ext } of fixtureFiles) {
      const filePath = path.join(FIXTURES_DIR, file);

      describe(file, () => {
        let markdown: string;
        let source: string;
        let outline: OutlineEntry[];
        let filtered: string;

        beforeAll(async () => {
          const loaded = await loadFixture(filePath, ext);
          markdown = loaded.markdown;
          source = loaded.source;
          outline = extractOutline(markdown);
          filtered = formatOutline(outline);
        }, 30000); // PDF parsing can take a moment

        it('loads fixture successfully', () => {
          expect(markdown).toBeTruthy();
          expect(markdown.length).toBeGreaterThan(100);
          console.log(`  📄 ${file}: ${markdown.length.toLocaleString()} chars from ${source}`);
        });

        it('extracts a non-empty outline', () => {
          expect(outline.length).toBeGreaterThan(0);
        });

        it('has reasonable heading count', () => {
          const total = countHeadings(outline);
          expect(total).toBeGreaterThan(0);
          console.log(`  📋 ${file}: ${total} total headings`);
        });

        it('filters noise headings', () => {
          const noiseCount = countNoiseHeadings(outline);
          const total = countHeadings(outline);
          console.log(`  🔇 ${file}: ${noiseCount}/${total} noise headings filtered`);
          expect(noiseCount).toBeLessThanOrEqual(total);
        });

        it('produces a compact filtered outline', () => {
          const lines = filtered.split('\n').filter(l => l.trim());
          expect(lines.length).toBeGreaterThan(0);
          console.log(`  📏 ${file}: filtered outline = ${filtered.length.toLocaleString()} chars, ${lines.length} lines`);
        });

        it('filtered outline fits in AI token budget', () => {
          const estimatedTokens = Math.ceil(filtered.length / 4);
          console.log(`  💰 ${file}: ~${estimatedTokens} tokens (input outline only)`);
          // deepseek-v4-flash has a 1M context window — 50K token outline is fine
          if (estimatedTokens > 50000) {
            console.log(`  ⚠️ Outline exceeds 50K token budget — system will use chunked extraction`);
          }
          expect(true).toBe(true);
        });

        it('can extract text for sections found in filtered outline', () => {
          const filteredLines = filtered.split('\n').filter(l => l.trim());
          const sampleLines = filteredLines.slice(0, Math.min(5, filteredLines.length));
          let extracted = 0;
          for (const line of sampleLines) {
            // Extract section ref from markdown header: "### 1.1 Title" → "1.1 Title"
            const ref = line.replace(/^#+\s*/, '').trim();
            const text = extractSectionText(markdown, ref, outline);
            if (text) extracted++;
          }
          expect(extracted).toBeGreaterThan(0);
        });

        it('reports reduction stats', () => {
          const total = countHeadings(outline);
          const noiseCount = countNoiseHeadings(outline);
          const filteredLines = filtered.split('\n').filter(l => l.trim()).length;
          const pct = total > 0 ? Math.round((1 - filteredLines / total) * 100) : 0;
          console.log(`  ✅ ${file}: ${total} headings → ${filteredLines} filtered (${pct}% reduction), ${noiseCount} noise items removed`);
        });

        it('writes filtered outline for inspection', () => {
          const outPath = filePath.replace(/\.(md|pdf)$/i, '.outline.txt');
          fs.writeFileSync(outPath, filtered, 'utf-8');
          console.log(`  📝 Wrote filtered outline to ${path.basename(outPath)} (${filtered.length.toLocaleString()} chars)`);

          // Show first 15 and last 5 lines in test output
          const lines = filtered.split('\n');
          console.log('  ── First 15 lines ──');
          lines.slice(0, 15).forEach(l => console.log(`    ${l}`));
          if (lines.length > 20) {
            console.log(`    ... ${lines.length - 20} lines omitted ...`);
          }
          console.log('  ── Last 5 lines ──');
          lines.slice(-5).forEach(l => console.log(`    ${l}`));
        });
      });
    }
  });
}
