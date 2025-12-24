// Tone Chart Tool

import { fetchDocAPI } from '../gdelt/client.js';
import type { ToneChartParams } from '../schemas/tool-schemas.js';
import type { ToneChartEntry, ToneBin } from '../gdelt/types.js';

/**
 * Get tone distribution histogram for sentiment analysis
 */
export async function getToneChart(params: ToneChartParams) {
  const response = await fetchDocAPI({
    query: params.query,
    mode: 'ToneChart',
    timespan: params.timespan,
  });

  // FIX: API returns { tonechart: [...] } where items have "bin" field, not "tone"
  // Access the tonechart array and map bin -> tone
  const bins = ((response as any).tonechart || []) as ToneBin[];

  // Map bins to ToneChartEntry format (bin -> tone)
  const toneChart: ToneChartEntry[] = bins.map(bin => ({
    tone: bin.bin,
    count: bin.count,
  }));

  // Calculate sentiment summary
  const negative = toneChart.filter((entry) => entry.tone < 0);
  const neutral = toneChart.filter((entry) => entry.tone === 0);
  const positive = toneChart.filter((entry) => entry.tone > 0);

  const negativeCount = negative.reduce((sum, entry) => sum + entry.count, 0);
  const neutralCount = neutral.reduce((sum, entry) => sum + entry.count, 0);
  const positiveCount = positive.reduce((sum, entry) => sum + entry.count, 0);
  const total = negativeCount + neutralCount + positiveCount;

  return {
    content: [
      {
        type: 'text' as const,
        text: `Tone distribution for "${params.query}":\n\n` +
          `Negative: ${negativeCount} (${((negativeCount / total) * 100).toFixed(1)}%)\n` +
          `Neutral: ${neutralCount} (${((neutralCount / total) * 100).toFixed(1)}%)\n` +
          `Positive: ${positiveCount} (${((positiveCount / total) * 100).toFixed(1)}%)\n\n` +
          `Detailed distribution:\n${toneChart
            .map((entry) => `Tone ${entry.tone}: ${entry.count} articles`)
            .join('\n')}`,
      },
    ],
    structuredContent: {
      toneChart,
      summary: {
        negative: negativeCount,
        neutral: neutralCount,
        positive: positiveCount,
        total,
      },
    },
  };
}

export const toneChartDefinition = {
  name: 'gdelt_tone_chart',
  description: 'Get sentiment/tone distribution histogram for a query. Negative values indicate negative sentiment, positive values indicate positive sentiment.',
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
        default: '3d',
      },
    },
    required: ['query'],
  },
};
