// GDELT API utility functions

/**
 * Build query string from parameters object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * Validate timespan parameter
 * Valid formats: 15min, 2h, 3d, 1w, 2m
 */
export function validateTimespan(timespan: string): boolean {
  const timespanRegex = /^\d+(min|h|d|w|m)$/;
  return timespanRegex.test(timespan);
}

/**
 * Parse GDELT datetime format (YYYYMMDDHHMMSS)
 */
export function parseGdeltDate(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  const hour = parseInt(dateStr.substring(8, 10)) || 0;
  const minute = parseInt(dateStr.substring(10, 12)) || 0;
  const second = parseInt(dateStr.substring(12, 14)) || 0;

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Format Date to GDELT datetime format (YYYYMMDDHHMMSS)
 */
export function formatGdeltDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}${second}`;
}
