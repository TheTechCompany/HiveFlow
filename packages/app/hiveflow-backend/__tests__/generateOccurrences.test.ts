/**
 * Unit tests for the pure generateOccurrences date-math utility.
 */
import { generateOccurrences } from '../src/utils/recurring';

function d(ymd: string): Date {
  return new Date(ymd + 'T00:00:00.000');
}

describe('generateOccurrences', () => {
  // ── Basic frequency smoke tests ──────────────────────────────

  it('generates daily occurrences within the horizon', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-01', frequency: 'daily' },
      d('2025-01-01'),
      d('2025-01-05'),
    );
    expect(dates).toEqual(['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04']);
  });

  it('generates weekly occurrences', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-01', frequency: 'weekly' },
      d('2025-01-01'),
      d('2025-01-22'),
    );
    expect(dates).toEqual(['2025-01-01', '2025-01-08', '2025-01-15']);
  });

  it('generates monthly occurrences', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-15', frequency: 'monthly' },
      d('2025-01-01'),
      d('2025-04-01'),
    );
    expect(dates).toEqual(['2025-01-15', '2025-02-15', '2025-03-15']);
  });

  it('generates quarterly occurrences', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-15', frequency: 'quarterly' },
      d('2025-01-01'),
      d('2025-10-01'),
    );
    expect(dates).toEqual(['2025-01-15', '2025-04-15', '2025-07-15']);
  });

  it('generates yearly occurrences', () => {
    const dates = generateOccurrences(
      { startDate: '2025-06-01', frequency: 'yearly' },
      d('2025-01-01'),
      d('2028-01-01'),
    );
    expect(dates).toEqual(['2025-06-01', '2026-06-01', '2027-06-01']);
  });

  // ── Horizon clamping ─────────────────────────────────────────

  it('clamps to horizonStart (does not include dates before)', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-01', frequency: 'monthly' },
      d('2025-03-01'),
      d('2025-06-01'),
    );
    // Jan and Feb fall before horizonStart, only March onward
    expect(dates).toEqual(['2025-03-01', '2025-04-01', '2025-05-01']);
  });

  it('clamps to horizonEnd (exclusive)', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-01', frequency: 'monthly' },
      d('2025-01-01'),
      d('2025-03-01'),
    );
    expect(dates).toEqual(['2025-01-01', '2025-02-01']);
  });

  // ── event endDate clamping ───────────────────────────────────

  it('stops at the event endDate', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-01', endDate: '2025-03-01', frequency: 'monthly' },
      d('2025-01-01'),
      d('2025-12-31'),
    );
    // EndDate 2025-03-01 means occurrences on 2025-01-01, 2025-02-01, 2025-03-01
    expect(dates).toEqual(['2025-01-01', '2025-02-01', '2025-03-01']);
  });

  it('allows null endDate to mean forever', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-01', endDate: null, frequency: 'monthly' },
      d('2025-01-01'),
      d('2025-04-01'),
    );
    expect(dates).toEqual(['2025-01-01', '2025-02-01', '2025-03-01']);
  });

  // ── Exception dates ──────────────────────────────────────────

  it('skips exception dates', () => {
    const dates = generateOccurrences(
      {
        startDate: '2025-01-01',
        frequency: 'monthly',
        exceptionDates: [{ originalDate: '2025-02-01' }, { originalDate: '2025-05-01' }],
      },
      d('2025-01-01'),
      d('2025-07-01'),
    );
    expect(dates).toEqual(['2025-01-01', '2025-03-01', '2025-04-01', '2025-06-01']);
  });

  it('handles null/undefined exceptionDates', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-01', frequency: 'monthly', exceptionDates: null },
      d('2025-01-01'),
      d('2025-03-01'),
    );
    expect(dates).toEqual(['2025-01-01', '2025-02-01']);
  });

  // ── Month-end clamping ───────────────────────────────────────

  it('clamps end-of-month dates: Jan 31 → Feb 28 → Mar 28', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-31', frequency: 'monthly' },
      d('2025-01-01'),
      d('2025-04-01'),
    );
    expect(dates).toEqual(['2025-01-31', '2025-02-28', '2025-03-28']);
  });

  it('handles Mar 31 → Apr 30 in non-leap year', () => {
    const dates = generateOccurrences(
      { startDate: '2025-03-31', frequency: 'monthly' },
      d('2025-03-01'),
      d('2025-06-01'),
    );
    expect(dates).toEqual(['2025-03-31', '2025-04-30', '2025-05-30']);
  });

  // ── Edge cases ───────────────────────────────────────────────

  it('returns empty for invalid startDate', () => {
    const dates = generateOccurrences(
      { startDate: 'not-a-date', frequency: 'monthly' },
      d('2025-01-01'),
      d('2025-12-31'),
    );
    expect(dates).toEqual([]);
  });

  it('returns empty when event ended before horizon', () => {
    const dates = generateOccurrences(
      { startDate: '2024-01-01', endDate: '2024-12-31', frequency: 'monthly' },
      d('2025-01-01'),
      d('2025-12-31'),
    );
    expect(dates).toEqual([]);
  });

  it('returns empty when horizonStart > horizonEnd', () => {
    const dates = generateOccurrences(
      { startDate: '2025-06-01', frequency: 'monthly' },
      d('2025-12-01'),
      d('2025-06-01'),
    );
    expect(dates).toEqual([]);
  });

  it('defaults unknown frequency to monthly', () => {
    const dates = generateOccurrences(
      { startDate: '2025-01-01', frequency: 'bimonthly' as any },
      d('2025-01-01'),
      d('2025-04-01'),
    );
    expect(dates).toEqual(['2025-01-01', '2025-02-01', '2025-03-01']);
  });

  it('is bounded by the 500-iteration safety cap', () => {
    // Daily event spanning >500 days — should not loop forever
    const dates = generateOccurrences(
      { startDate: '2025-01-01', frequency: 'daily', endDate: null },
      d('2025-01-01'),
      d('2027-06-01'), // ~880 days
    );
    expect(dates.length).toBe(500);
  });
});
