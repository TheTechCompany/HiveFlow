import {
  extractOutline,
  formatOutline,
  isHeadingNoise,
  extractJsonArray,
  extractSectionText,
  NOISE_PATTERNS,
  OutlineEntry,
} from '../src/schema/compliance';
import { htmlToMarkdown } from '../src/schema/legislation-sources';

// ── Sample markdown simulating NZ legislation ──────────────────

const SAMPLE_MARKDOWN = `# Health and Safety at Work Act 2015

## Part 1 — Preliminary

### s.3 Purpose
The main purpose of this Act is to provide for a balanced framework...

### s.4 Definitions
In this Act, unless the context otherwise requires...

## Part 2 — Health and safety duties

### s.36 Primary duty of care
A PCBU must ensure, so far as is reasonably practicable, the health and safety of workers...

### s.37 Duty of officers
If a PCBU has a duty or obligation under this Act, an officer of the PCBU must exercise due diligence...

### s.38 Duty of workers
While at work, a worker must take reasonable care for his or her own health and safety...

## Part 3 — Enforcement

### s.101 Power to issue improvement notices
An inspector may issue an improvement notice if they reasonably believe...

### s.102 Power to issue prohibition notices
An inspector may issue a prohibition notice if they reasonably believe...

### s.103 Offences
A person who fails to comply with a health and safety duty commits an offence...

## Schedule 1 — Transitional provisions

### Schedule 1 clause 1
Interpretation in this schedule...

## Schedule 2 — Consequential amendments

### Schedule 2 Accident Compensation Act 2001
### Schedule 2 item 28: added, on 17 January 2008, by clause 4 of the Injury Prevention, Rehabilitation, and Compensation Amendment Act 2007
### Schedule 2 item 29: added, on 17 January 2008, by clause 4 of the Injury Prevention, Rehabilitation, and Compensation Amendment Act 2007
### Schedule 2 item 30: added, on 17 January 2008, by clause 4 of the Injury Prevention, Rehabilitation, and Compensation Amendment Act 2007

## Schedule 3 — Repealed provisions

### Schedule 3 clause 1 — Repealed
The Health and Safety in Employment Act 1992 is repealed.

### Schedule 3 clause 2 — Amended by clause 5 of the Regulatory Reform Act 2018
`;

// ── extractOutline ─────────────────────────────────────────────

describe('extractOutline', () => {
  it('extracts all #, ##, ### headings from markdown', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    expect(outline.length).toBe(1); // single # at root
    expect(outline[0].heading).toBe('Health and Safety at Work Act 2015');
    expect(outline[0].level).toBe(1);
  });

  it('captures child headings at correct levels', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const parts = outline[0].children;
    expect(parts.length).toBeGreaterThanOrEqual(5); // Part 1, 2, 3, Schedule 1, 2, 3
    expect(parts[0].heading).toBe('Part 1 — Preliminary');
    expect(parts[0].level).toBe(2);
  });

  it('captures ### subsection headings', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const part1 = outline[0].children[0]; // Part 1
    const subsections = part1.children;
    expect(subsections.length).toBe(2); // s.3, s.4
    expect(subsections[0].heading).toBe('s.3 Purpose');
    expect(subsections[0].level).toBe(3);
  });

  it('records correct lineIndex for text extraction', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const s36 = outline[0].children[1].children[0]; // Part 2 > s.36
    const lines = SAMPLE_MARKDOWN.split('\n');
    expect(lines[s36.lineIndex]).toContain('### s.36 Primary duty of care');
  });

  it('captures schedule amendment items at ### level', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const schedule2 = outline[0].children.find(c => c.heading.includes('Schedule 2'));
    expect(schedule2).toBeDefined();
    // Should include noise items (filtering happens in formatOutline, not extractOutline)
    const items = schedule2!.children.filter(c => c.heading.includes('item'));
    expect(items.length).toBe(3); // items 28, 29, 30
  });
});

// ── isHeadingNoise ─────────────────────────────────────────────

describe('isHeadingNoise', () => {
  it('flags "added, on" amendment notes', () => {
    expect(isHeadingNoise('Schedule 2 item 28: added, on 17 January 2008')).toBe(true);
  });

  it('flags "repealed" headings', () => {
    expect(isHeadingNoise('Schedule 3 clause 1 — Repealed')).toBe(true);
  });

  it('flags "amended by" headings', () => {
    expect(isHeadingNoise('Schedule 3 clause 2 — Amended by clause 5')).toBe(true);
  });

  it('flags "Item N:" schedule references', () => {
    expect(isHeadingNoise('Item 28: added, on 17 January 2008')).toBe(true);
  });

  it('flags "Schedule N item N" pattern', () => {
    expect(isHeadingNoise('Schedule 2 item 28: added, on 17 January 2008')).toBe(true);
  });

  it('flags headings longer than 100 characters', () => {
    const long = 'A'.repeat(101);
    expect(isHeadingNoise(long)).toBe(true);
  });

  it('does NOT flag legitimate compliance sections', () => {
    expect(isHeadingNoise('s.36 Primary duty of care')).toBe(false);
    expect(isHeadingNoise('s.101 Power to issue improvement notices')).toBe(false);
    expect(isHeadingNoise('Part 2 — Health and safety duties')).toBe(false);
    expect(isHeadingNoise('Health and Safety at Work Act 2015')).toBe(false);
    expect(isHeadingNoise('Schedule 1 — Transitional provisions')).toBe(false);
  });

  it('does NOT flag "amended" without "by" (legislative references)', () => {
    // "Provisions amended" alone isn't an amendment note pattern
    expect(isHeadingNoise('Provisions amended')).toBe(false);
  });

  it('covers all NOISE_PATTERNS', () => {
    expect(NOISE_PATTERNS.length).toBeGreaterThanOrEqual(16);
  });

  // ── PDF extraction junk patterns ──────────────────────────
  it('flags number table rows', () => {
    expect(isHeadingNoise('100,000 1.5 1')).toBe(true);
    expect(isHeadingNoise('10,000,000 14 10')).toBe(true);
    expect(isHeadingNoise('250,000 3 2')).toBe(true);
  });

  it('flags reference fragments like 4.1.2A, 4.1.2B', () => {
    expect(isHeadingNoise('4.1.2A, 4.1.2B')).toBe(true);
    expect(isHeadingNoise('19.7')).toBe(true);
    expect(isHeadingNoise('4.1.2A')).toBe(true);
  });

  it('flags bare dollar amounts and percentages', () => {
    expect(isHeadingNoise('$ 100,000')).toBe(true);
    expect(isHeadingNoise('50%')).toBe(true);
  });

  it('flags bare subsection markers', () => {
    expect(isHeadingNoise('(1)')).toBe(true);
    expect(isHeadingNoise('a)')).toBe(true);
  });

  it('flags fragmented regulation references', () => {
    expect(isHeadingNoise('regulation 19.7,—')).toBe(true);
  });

  it('flags garbled PDF text without 3+ consecutive letters', () => {
    expect(isHeadingNoise('D, PC D, PC D, PC')).toBe(true);
    expect(isHeadingNoise('A, BC A, BC')).toBe(true);
    expect(isHeadingNoise('LI 2017/131')).toBe(true);
    expect(isHeadingNoise('s.36 Primary duty of care')).toBe(false); // has "Primary"
    expect(isHeadingNoise('Part 1')).toBe(false);
  });
});

// ── formatOutline (filtered) ───────────────────────────────────

describe('formatOutline', () => {
  it('produces markdown heading markers instead of breadcrumbs', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const text = formatOutline(outline);
    const lines = text.split('\n');
    expect(lines[0]).toBe('# Health and Safety at Work Act 2015');
    expect(lines[1]).toBe('## Part 1 — Preliminary');
    expect(lines[2]).toBe('### s.3 Purpose');
  });

  it('filters out amendment noise items', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const text = formatOutline(outline);
    expect(text).not.toContain('item 28');
    expect(text).not.toContain('item 29');
    expect(text).not.toContain('item 30');
    expect(text).not.toContain('added, on');
    expect(text).not.toContain('Repealed');
    expect(text).not.toContain('Amended by');
  });

  it('keeps legitimate compliance sections', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const text = formatOutline(outline);
    expect(text).toContain('### s.36 Primary duty of care');
    expect(text).toContain('### s.37 Duty of officers');
    expect(text).toContain('### s.101 Power to issue improvement notices');
    expect(text).toContain('### s.103 Offences');
  });

  it('reduces outline size compared to unfiltered', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const filtered = formatOutline(outline);

    function countAll(entries: OutlineEntry[]): number {
      let n = 0;
      for (const e of entries) {
        n++;
        n += countAll(e.children);
      }
      return n;
    }
    const totalHeadings = countAll(outline);
    const filteredLines = filtered.split('\n').filter(l => l.trim()).length;

    expect(filteredLines).toBeLessThan(totalHeadings);
    expect(filteredLines).toBeGreaterThan(0);
  });

  it('does not recurse into level 3 children', () => {
    const outline = extractOutline(SAMPLE_MARKDOWN);
    const text = formatOutline(outline);
    const lines = text.split('\n');
    for (const line of lines) {
      // Max marker is ### (level 3)
      expect(line).not.toMatch(/^####/);
    }
  });
});

// ── extractJsonArray ───────────────────────────────────────────

describe('extractJsonArray', () => {
  it('parses a complete JSON string array', () => {
    const result = extractJsonArray('["s.36", "s.37", "s.38"]');
    expect(result).toEqual(['s.36', 's.37', 's.38']);
  });

  it('parses a complete JSON object array', () => {
    const result = extractJsonArray('[{"sectionRef":"s.36","title":"Duty of care"}]');
    expect(result).toEqual([{ sectionRef: 's.36', title: 'Duty of care' }]);
  });

  it('handles markdown code fences', () => {
    const result = extractJsonArray('```json\n["s.36", "s.37"]\n```');
    expect(result).toEqual(['s.36', 's.37']);
  });

  it('handles leading/trailing text', () => {
    const result = extractJsonArray('Here are sections: ["s.36", "s.37"] end.');
    expect(result).toEqual(['s.36', 's.37']);
  });

  it('repairs truncated string array (cut mid-string)', () => {
    // Simulates: ["s.36", "s.37", "s.3  (truncated before closing quote)
    const result = extractJsonArray('["s.36", "s.37", "s.3');
    expect(result).toEqual(['s.36', 's.37']);
  });

  it('repairs truncated string array with single complete item', () => {
    const result = extractJsonArray('["s.36", "s');
    expect(result).toEqual(['s.36']);
  });

  it('repairs truncated object array', () => {
    const result = extractJsonArray('[{"sectionRef":"s.36","title":"Duty"},{"sectionRef":"s.3');
    expect(result).toEqual([{ sectionRef: 's.36', title: 'Duty' }]);
  });

  it('throws when content has no array at all', () => {
    expect(() => extractJsonArray('no array here')).toThrow('No JSON array found');
  });

  it('throws when truncated response has zero complete items', () => {
    expect(() => extractJsonArray('["s')).toThrow('No JSON array found');
  });

  it('handles nested brackets via greedy fallback', () => {
    const result = extractJsonArray('[{"nested":[1,2]},{"x":3}] extra text [ignore]');
    expect(result).toEqual([{ nested: [1, 2] }, { x: 3 }]);
  });
});

// ── extractSectionText ─────────────────────────────────────────

describe('extractSectionText', () => {
  const outline = extractOutline(SAMPLE_MARKDOWN);

  it('extracts the full text of a ### section', () => {
    const text = extractSectionText(SAMPLE_MARKDOWN, 's.36', outline);
    expect(text).toBeDefined();
    expect(text).toContain('### s.36 Primary duty of care');
    expect(text).toContain('A PCBU must ensure');
  });

  it('stops at the next heading of same or higher level', () => {
    const text = extractSectionText(SAMPLE_MARKDOWN, 's.36', outline);
    expect(text).not.toContain('s.37'); // next section should be excluded
  });

  it('extracts ## section text down to next part', () => {
    const text = extractSectionText(SAMPLE_MARKDOWN, 'Part 2', outline);
    expect(text).toBeDefined();
    expect(text).toContain('## Part 2 — Health and safety duties');
    expect(text).toContain('s.36');
    expect(text).toContain('s.38');
    expect(text).not.toContain('Part 3'); // next part excluded
  });

  it('returns null for unmatched section ref', () => {
    const text = extractSectionText(SAMPLE_MARKDOWN, 'nonexistent', outline);
    expect(text).toBeNull();
  });

  it('matches fuzzy (case-insensitive, partial)', () => {
    const text = extractSectionText(SAMPLE_MARKDOWN, 'primary duty', outline);
    expect(text).toBeDefined();
    expect(text).toContain('s.36 Primary duty of care');
  });
});

// ── htmlToMarkdown ─────────────────────────────────────────────

describe('htmlToMarkdown', () => {
  it('converts h1-h4 to markdown headings', () => {
    const html = '<main><h1>Health and Safety at Work Act</h1><h2>Part 1</h2><h3>s.3 Purpose</h3></main>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('# Health and Safety at Work Act');
    expect(md).toContain('## Part 1');
    expect(md).toContain('### s.3 Purpose');
  });

  it('converts paragraphs', () => {
    const html = '<p>This is a paragraph of text.</p><p>Another paragraph.</p>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('This is a paragraph of text.');
    expect(md).toContain('Another paragraph.');
  });

  it('converts list items', () => {
    const html = '<ul><li>First item</li><li>Second item</li></ul>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('- First item');
    expect(md).toContain('- Second item');
  });

  it('strips remaining HTML tags', () => {
    const html = '<div><span>Text with <b>bold</b> formatting</span></div>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('Text with bold formatting');
    expect(md).not.toContain('<b>');
  });

  it('decodes HTML entities', () => {
    const html = '<p>Section &amp; Schedule &quot;A&quot;</p>';
    const md = htmlToMarkdown(html);
    expect(md).toContain('Section & Schedule "A"');
  });

  it('produces valid outline when fed through extractOutline', () => {
    const html = `
      <h1>Hazardous Substances Regulations 2017</h1>
      <h2>Part 1 — Preliminary</h2>
      <h3>3 Purpose</h3><p>The purpose of these regulations is...</p>
      <h3>4 Definitions</h3><p>In these regulations, unless the context otherwise requires...</p>
      <h2>Part 2 — Duties</h2>
      <h3>36 Primary duty of care</h3><p>A PCBU must ensure...</p>`;
    const md = htmlToMarkdown(html);
    const outline = extractOutline(md);
    expect(outline.length).toBe(1);
    expect(outline[0].heading).toBe('Hazardous Substances Regulations 2017');
    const parts = outline[0].children;
    expect(parts.length).toBe(2);
    expect(parts[0].heading).toBe('Part 1 — Preliminary');
    expect(parts[0].children[0].heading).toBe('3 Purpose');
    expect(parts[1].children[0].heading).toBe('36 Primary duty of care');
  });
});
