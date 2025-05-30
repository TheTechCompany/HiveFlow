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