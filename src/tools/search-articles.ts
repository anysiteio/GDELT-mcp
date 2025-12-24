// Search Articles Tool

import { fetchDocAPI } from '../gdelt/client.js';
import type { SearchArticlesParams } from '../schemas/tool-schemas.js';
import type { Article } from '../gdelt/types.js';

/**
 * Search for articles matching query with filters
 */
export async function searchArticles(params: SearchArticlesParams) {
  const response = await fetchDocAPI({
    query: params.query,
    mode: 'ArtList',
    timespan: params.timespan,
    maxrecords: params.maxrecords,
    sort: params.sort,
  });

  const articles: Article[] = response.articles || [];

  return {
    content: [
      {
        type: 'text' as const,
        text: `Found ${articles.length} articles:\n\n${articles
          .map(
            (article, i) =>
              `${i + 1}. ${article.title}\n   URL: ${article.url}\n   Domain: ${article.domain}\n   Language: ${article.language}\n   Country: ${article.sourcecountry}\n   Date: ${article.seendate}`
          )
          .join('\n\n')}`,
      },
    ],
    structuredContent: {
      articles,
      count: articles.length,
    },
  };
}

export const searchArticlesDefinition = {
  name: 'gdelt_search_articles',
  description: 'Search GDELT for news articles matching a query with optional filters (domain, country, language, tone, etc.)',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string' as const,
        description: 'Search query with operators. Examples: "climate change", domain:cnn.com, sourcecountry:russia, tone<-5',
      },
      timespan: {
        type: 'string' as const,
        description: 'Time window (e.g., 15min, 2h, 3d, 1w, 2m). Max 3 months.',
        default: '3d',
      },
      maxrecords: {
        type: 'number' as const,
        description: 'Maximum number of results (1-250)',
        default: 75,
      },
      sort: {
        type: 'string' as const,
        enum: ['DateDesc', 'DateAsc', 'ToneDesc', 'ToneAsc', 'HybridRel'],
        description: 'Sort order',
        default: 'DateDesc',
      },
    },
    required: ['query'],
  },
};
