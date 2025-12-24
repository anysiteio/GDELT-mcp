// Monitor Tool

import { fetchDocAPI } from '../gdelt/client.js';
import type { MonitorParams } from '../schemas/tool-schemas.js';
import type { Article } from '../gdelt/types.js';

/**
 * Monitor real-time news for a query
 */
export async function monitor(params: MonitorParams) {
  const response = await fetchDocAPI({
    query: params.query,
    mode: 'ArtList',
    timespan: params.interval,
    maxrecords: 250,
    sort: 'DateDesc',
  });

  const articles: Article[] = response.articles || [];

  return {
    content: [
      {
        type: 'text' as const,
        text: `Monitoring "${params.query}" (last ${params.interval}):\n\n` +
          `Found ${articles.length} recent articles:\n\n${articles
            .slice(0, 10) // Show top 10 in text
            .map(
              (article, i) =>
                `${i + 1}. ${article.title}\n   URL: ${article.url}\n   Domain: ${article.domain}\n   Date: ${article.seendate}`
            )
            .join('\n\n')}${articles.length > 10 ? '\n\n... and more (see structured data)' : ''}`,
      },
    ],
    structuredContent: {
      articles,
      count: articles.length,
      interval: params.interval,
      query: params.query,
    },
  };
}

export const monitorDefinition = {
  name: 'gdelt_monitor',
  description: 'Monitor real-time news coverage for a query. Returns latest articles in the specified time interval (GDELT updates every 15 minutes)',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string' as const,
        description: 'Search query to monitor',
      },
      interval: {
        type: 'string' as const,
        enum: ['15min', '1h', '3h'],
        description: 'Monitoring interval',
        default: '15min',
      },
    },
    required: ['query'],
  },
};
