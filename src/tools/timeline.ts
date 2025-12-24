// Timeline Tool

import { fetchDocAPI } from '../gdelt/client.js';
import type { TimelineParams } from '../schemas/tool-schemas.js';
import type { TimelineEntry } from '../gdelt/types.js';

/**
 * Get timeline analysis (volume, tone, language, or source country)
 */
export async function getTimeline(params: TimelineParams) {
  // Map timeline_type to GDELT mode
  const modeMap = {
    volume: 'TimelineVol',
    tone: 'TimelineTone',
    language: 'TimelineLang',
    sourcecountry: 'TimelineSourceCountry',
  };

  const mode = modeMap[params.timeline_type || 'volume'];

  const response = await fetchDocAPI({
    query: params.query,
    mode,
    timespan: params.timespan,
  });

  // FIX: Extract timeline data from nested structure: response.timeline[0].data
  const timeline: TimelineEntry[] = response.timeline?.[0]?.data || [];

  return {
    content: [
      {
        type: 'text' as const,
        text: `Timeline analysis (${params.timeline_type}):\n\n${timeline
          .map((entry) => `${entry.date}: ${entry.value}`)
          .join('\n')}`,
      },
    ],
    structuredContent: {
      timeline,
      type: params.timeline_type,
      count: timeline.length,
    },
  };
}

export const timelineDefinition = {
  name: 'gdelt_timeline',
  description: 'Get timeline analysis showing volume, tone, language distribution, or source country distribution over time',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string' as const,
        description: 'Search query',
      },
      timespan: {
        type: 'string' as const,
        description: 'Time window (e.g., 15min, 2h, 3d, 1w, 2m)',
        default: '1w',
      },
      timeline_type: {
        type: 'string' as const,
        enum: ['volume', 'tone', 'language', 'sourcecountry'],
        description: 'Type of timeline analysis',
        default: 'volume',
      },
    },
    required: ['query'],
  },
};
