// ── NZ Public Holidays ──────────────────────────────────────────────
// Zero-dependency module providing New Zealand public holiday dates.
//
// Sources:
//   - Holidays Act 2003
//   - MBIE Matariki dates 2022–2052
//     (https://www.mbie.govt.nz/assets/matariki-dates-2022-to-2052-matariki-advisory-group.pdf)
//   - Employment NZ regional anniversary dates
//
// Mondayisation rules (Holidays Act 2003, ss 44–45):
//   - Waitangi Day, ANZAC Day: if Sat/Sun → following Monday
//   - Christmas Day (25 Dec), New Year's Day (1 Jan): if Sat/Sun → following Monday
//   - Boxing Day (26 Dec), Day after New Year's (2 Jan):
//       if Sat → following Monday; if Sun → following Tuesday
//   - Consecutive rule: when 25 Dec is Sat AND 26 Dec is Sun,
//       Christmas → Mon 27th, Boxing Day → Tue 28th (already handled above)

// ── Types ───────────────────────────────────────────────────────────

export interface NzHoliday {
  date: Date;
  name: string;
  /** Undefined = national holiday. Otherwise the province/region name. */
  region?: string;
}

// ── Easter (Anonymous Gregorian algorithm) ──────────────────────────

/** Return Easter Sunday for the given year. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

// ── Helpers ─────────────────────────────────────────────────────────

function dateStr(year: number, month: number, day: number): Date {
  // Use noon UTC so the date portion is stable across all timezones
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

/** Mondayise a date: if it falls on Sat/Sun, return the following Monday.
 *  If the following Monday is also a holiday (consecutive), return Tuesday. */
function mondayise(d: Date): Date {
  const dow = d.getUTCDay();
  if (dow === 0) return addDays(d, 1); // Sunday → Monday
  if (dow === 6) return addDays(d, 2); // Saturday → Monday
  return d;
}

/** Mondayise for "day after" holidays (2 Jan, 26 Dec):
 *  Sat → Mon, Sun → Tue */
function mondayiseDayAfter(d: Date): Date {
  const dow = d.getUTCDay();
  if (dow === 6) return addDays(d, 2); // Saturday → Monday
  if (dow === 0) return addDays(d, 2); // Sunday → Tuesday
  return d;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

function nthWeekdayOfMonth(
  year: number,
  month: number, // 1-based
  weekday: number, // 0=Sun … 6=Sat
  n: number, // 1st, 2nd, 3rd, 4th
): Date {
  const first = dateStr(year, month, 1);
  const firstDow = first.getUTCDay();
  const day = 1 + ((weekday - firstDow + 7) % 7) + (n - 1) * 7;
  return dateStr(year, month, day);
}

function closestWeekdayTo(
  year: number,
  month: number,
  day: number,
  weekday: number,
): Date {
  const target = dateStr(year, month, day);
  const dow = target.getUTCDay();
  const diff = weekday - dow;
  if (Math.abs(diff) <= 3) return addDays(target, diff);
  // Go to the weekday in the other direction
  if (diff > 0) return addDays(target, diff - 7);
  return addDays(target, diff + 7);
}

// Closest Monday
function closestMonday(year: number, month: number, day: number): Date {
  return closestWeekdayTo(year, month, day, 1);
}

// ── Fixed-date national holidays ────────────────────────────────────

function newYearsDay(year: number): NzHoliday {
  return { date: mondayise(dateStr(year, 1, 1)), name: "New Year's Day" };
}

function dayAfterNewYears(year: number): NzHoliday {
  return { date: mondayiseDayAfter(dateStr(year, 1, 2)), name: 'Day after New Year\'s Day' };
}

function waitangiDay(year: number): NzHoliday {
  return { date: mondayise(dateStr(year, 2, 6)), name: 'Waitangi Day' };
}

function anzacDay(year: number): NzHoliday {
  return { date: mondayise(dateStr(year, 4, 25)), name: 'ANZAC Day' };
}

function christmasDay(year: number): NzHoliday {
  return { date: mondayise(dateStr(year, 12, 25)), name: 'Christmas Day' };
}

function boxingDay(year: number): NzHoliday {
  return { date: mondayiseDayAfter(dateStr(year, 12, 26)), name: 'Boxing Day' };
}

// ── Easter-based national holidays ──────────────────────────────────

function goodFriday(year: number): NzHoliday {
  return { date: addDays(easterSunday(year), -2), name: 'Good Friday' };
}

function easterMonday(year: number): NzHoliday {
  return { date: addDays(easterSunday(year), 1), name: 'Easter Monday' };
}

// ── Matariki (MBIE official dates 2022–2052) ──────────────────────

const MATARIKI_DATES: Record<number, [number, number]> = {
  2022: [6, 24], 2023: [7, 14], 2024: [6, 28], 2025: [6, 20],
  2026: [7, 10], 2027: [6, 25], 2028: [7, 14], 2029: [7, 6],
  2030: [6, 21], 2031: [7, 11], 2032: [7, 2], 2033: [6, 24],
  2034: [7, 7], 2035: [6, 29], 2036: [7, 18], 2037: [7, 10],
  2038: [6, 25], 2039: [7, 15], 2040: [7, 6], 2041: [7, 19],
  2042: [7, 11], 2043: [7, 3], 2044: [6, 24], 2045: [7, 7],
  2046: [6, 29], 2047: [7, 19], 2048: [7, 3], 2049: [6, 25],
  2050: [7, 15], 2051: [6, 30], 2052: [6, 21],
};

function matariki(year: number): NzHoliday | null {
  const d = MATARIKI_DATES[year];
  if (!d) return null; // Matariki dates only defined through 2052
  return { date: dateStr(year, d[0], d[1]), name: 'Matariki' };
}

// ── Other national holidays ─────────────────────────────────────────

function kingsBirthday(year: number): NzHoliday {
  return { date: nthWeekdayOfMonth(year, 6, 1, 1), name: "King's Birthday" };
}

function labourDay(year: number): NzHoliday {
  return { date: nthWeekdayOfMonth(year, 10, 1, 4), name: 'Labour Day' };
}

// ── Provincial anniversary days ────────────────────────────────────

interface ProvincialDef {
  name: string;
  fn: (year: number) => Date;
}

const PROVINCIAL: ProvincialDef[] = [
  {
    name: 'Auckland Anniversary',
    fn: (y) => closestMonday(y, 1, 29),
  },
  {
    name: 'Taranaki Anniversary',
    fn: (y) => nthWeekdayOfMonth(y, 3, 1, 2),
  },
  {
    name: "Hawke's Bay Anniversary",
    fn: (y) => addDays(nthWeekdayOfMonth(y, 10, 1, 4), -3), // Friday before Labour Day
  },
  {
    name: 'Wellington Anniversary',
    fn: (y) => closestMonday(y, 1, 22),
  },
  {
    name: 'Marlborough Anniversary',
    fn: (y) => addDays(nthWeekdayOfMonth(y, 10, 1, 4), 7), // First Monday after Labour Day
  },
  {
    name: 'Nelson Anniversary',
    fn: (y) => closestMonday(y, 2, 1),
  },
  {
    name: 'Canterbury Anniversary',
    fn: (y) => {
      // Second Friday after first Tuesday in November
      const firstTue = nthWeekdayOfMonth(y, 11, 2, 1);
      return addDays(firstTue, 10); // +3 days to Friday, +7 to second Friday = +10
    },
  },
  {
    name: 'South Canterbury Anniversary',
    fn: (y) => nthWeekdayOfMonth(y, 9, 1, 4), // Fourth Monday in September
  },
  {
    name: 'Southland Anniversary',
    fn: (y) => addDays(easterSunday(y), 2), // Easter Tuesday
  },
  {
    name: 'Otago Anniversary',
    fn: (y) => closestMonday(y, 3, 23),
  },
  {
    name: 'Chatham Islands Anniversary',
    fn: (y) => closestMonday(y, 11, 30),
  },
  {
    name: 'Westland Anniversary',
    fn: (y) => closestMonday(y, 12, 1),
  },
];

// ── Public API ──────────────────────────────────────────────────────

/**
 * Return all NZ public holidays for a given year.
 *
 * @param year  The calendar year.
 * @param region  Optional region filter. When provided, only national holidays
 *                and holidays for that region are returned. Region names match
 *                the anniversary day names (e.g. "Auckland Anniversary",
 *                "Canterbury Anniversary"). Pass `undefined` for national only.
 * @returns Array of holidays sorted by date.
 */
export function getNzPublicHolidays(year: number, region?: string): NzHoliday[] {
  const holidays: NzHoliday[] = [];

  // National holidays
  holidays.push(newYearsDay(year));
  holidays.push(dayAfterNewYears(year));
  holidays.push(waitangiDay(year));
  holidays.push(anzacDay(year));
  holidays.push(goodFriday(year));
  holidays.push(easterMonday(year));
  holidays.push(kingsBirthday(year));
  holidays.push(labourDay(year));
  holidays.push(christmasDay(year));
  holidays.push(boxingDay(year));

  const m = matariki(year);
  if (m) holidays.push(m);

  // Provincial
  for (const p of PROVINCIAL) {
    if (region && p.name !== region) continue;
    holidays.push({ date: p.fn(year), name: p.name, region: p.name });
  }

  // Sort by date
  holidays.sort((a, b) => a.date.getTime() - b.date.getTime());

  // ── Resolve consecutive-holiday collisions ──────────────────────
  // When New Year's Day (Sun) Mondayises onto Day after New Year's date,
  // or Christmas Day (Sun) Mondayises onto Boxing Day's date,
  // push the "day after" holiday forward by one day.
  for (let i = 0; i < holidays.length - 1; i++) {
    const a = holidays[i];
    const b = holidays[i + 1];
    if (a.date.getTime() === b.date.getTime()) {
      if (
        (a.name === "New Year's Day" && b.name === "Day after New Year's Day") ||
        (a.name === 'Christmas Day' && b.name === 'Boxing Day')
      ) {
        b.date = addDays(b.date, 1);
      }
    }
  }

  return holidays;
}
