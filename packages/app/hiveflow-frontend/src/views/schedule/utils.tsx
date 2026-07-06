export function mergeDateRanges(ranges : {start: Date, end: Date}[]) {
    // const OVERLAP_MIN = 60 * 1000; //1 minute

    if (!ranges.length) return [];
  
    // Convert all dates to Date objects if needed
    const parsed = ranges.map(({ start, end }) => ({
      start: new Date(start),
      end: new Date(end),
    }));
  
    // Sort by start date
    parsed.sort((a, b) => a.start.getTime() - b.start.getTime());
  
    const merged = [parsed[0]];
  
    for (let i = 1; i < parsed.length; i++) {
      const last = merged[merged.length - 1];
      const current = parsed[i];
  
      // If current range overlaps or is contiguous with the last
      if (current.start <= new Date(last.end.getTime())) {
        // Merge by extending the end date
        last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
      } else {
        // Otherwise, start a new range
        merged.push(current);
      }
    }
  
    return merged;
  }

  /**
   * Subtract a set of cut intervals from a set of source intervals.
   * Returns the remaining non-overlapping segments.
   */
  export function subtractIntervals(
    intervals: { start: Date; end: Date }[],
    cuts: { start: Date; end: Date }[],
  ): { start: Date; end: Date }[] {
    let result = [...intervals];
    for (const cut of cuts) {
      const next: { start: Date; end: Date }[] = [];
      for (const seg of result) {
        if (cut.end <= seg.start || cut.start >= seg.end) {
          // No overlap — keep the segment intact
          next.push(seg);
        } else {
          // Keep the left portion before the cut (if any)
          if (cut.start > seg.start) {
            next.push({ start: seg.start, end: cut.start });
          }
          // Keep the right portion after the cut (if any)
          if (cut.end < seg.end) {
            next.push({ start: cut.end, end: seg.end });
          }
          // The overlapping middle is removed
        }
      }
      result = next;
    }
    return result;
  }