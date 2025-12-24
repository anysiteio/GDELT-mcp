// Zod schemas for MCP tool parameters validation

import { z } from 'zod';

// Common schemas
export const QuerySchema = z.string().min(1, 'Query cannot be empty');
export const TimespanSchema = z.string().regex(/^\d+(min|h|d|w|m)$/, 'Invalid timespan format').optional();
export const MaxRecordsSchema = z.number().int().min(1).max(250).optional();
export const SortSchema = z.enum(['DateDesc', 'DateAsc', 'ToneDesc', 'ToneAsc', 'HybridRel']).optional();

// Search Articles schema
export const SearchArticlesSchema = z.object({
  query: QuerySchema,
  timespan: TimespanSchema.default('3d'),
  maxrecords: MaxRecordsSchema.default(75),
  sort: SortSchema.default('DateDesc'),
});

export type SearchArticlesParams = z.infer<typeof SearchArticlesSchema>;

// Timeline schema
export const TimelineSchema = z.object({
  query: QuerySchema,
  timespan: TimespanSchema.default('1w'),
  timeline_type: z.enum(['volume', 'tone', 'language', 'sourcecountry']).optional().default('volume'),
});

export type TimelineParams = z.infer<typeof TimelineSchema>;

// Tone Chart schema
export const ToneChartSchema = z.object({
  query: QuerySchema,
  timespan: TimespanSchema.default('3d'),
});

export type ToneChartParams = z.infer<typeof ToneChartSchema>;

// Geo Search schema
// Note: GDELT GEO API only supports PointData mode for JSON output
export const GeoSearchSchema = z.object({
  query: QuerySchema,
  timespan: TimespanSchema.default('1d'),
  maxpoints: z.number().int().min(1).max(1000).optional().default(100),
});

export type GeoSearchParams = z.infer<typeof GeoSearchSchema>;

// Image Search schema
export const ImageSearchSchema = z.object({
  query: QuerySchema,
  timespan: TimespanSchema.default('3d'),
  maxrecords: MaxRecordsSchema.default(75),
});

export type ImageSearchParams = z.infer<typeof ImageSearchSchema>;

// Monitor schema
export const MonitorSchema = z.object({
  query: QuerySchema,
  interval: z.enum(['15min', '1h', '3h']).optional().default('15min'),
});

export type MonitorParams = z.infer<typeof MonitorSchema>;
