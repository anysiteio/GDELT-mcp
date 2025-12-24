// Image Search Tool

import { fetchDocAPI } from '../gdelt/client.js';
import type { ImageSearchParams } from '../schemas/tool-schemas.js';
import type { ImageInfo } from '../gdelt/types.js';

/**
 * Search for images using VGKG (Visual Knowledge Graph)
 */
export async function imageSearch(params: ImageSearchParams) {
  // Note: Image Gallery modes only support HTML output, not JSON
  // So we use ArtList mode and return articles with socialimage field
  const response = await fetchDocAPI({
    query: params.query,
    mode: 'ArtList',
    timespan: params.timespan,
    maxrecords: params.maxrecords,
  });

  // Extract articles that have social images
  const articles = response.articles || [];
  const articlesWithImages = articles.filter(a => a.socialimage);

  // Convert articles to ImageInfo format
  const images: ImageInfo[] = articlesWithImages.map(article => ({
    url: article.socialimage || '',
    webcount: undefined,
    tags: undefined,
    webtags: undefined,
    ocr: undefined,
    facetone: undefined,
    numfaces: undefined,
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: `Found ${articlesWithImages.length} articles with images:\n\n${articlesWithImages
          .map((article, i) =>
            `${i + 1}. ${article.title}\n   Image: ${article.socialimage}\n   Source: ${article.domain}\n   URL: ${article.url}`
          )
          .join('\n\n')}`,
      },
    ],
    structuredContent: {
      articles: articlesWithImages,
      images,
      count: articlesWithImages.length,
    },
  };
}

export const imageSearchDefinition = {
  name: 'gdelt_image_search',
  description: 'Search for news articles that have associated social images. Returns articles with preview images/thumbnails.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string' as const,
        description: 'Search query for articles. Examples: "flood", "protest", "election"',
      },
      timespan: {
        type: 'string' as const,
        description: 'Time window (e.g., 15min, 2h, 3d, 1w, 2m)',
        default: '3d',
      },
      maxrecords: {
        type: 'number' as const,
        description: 'Maximum number of images (1-250)',
        default: 75,
      },
    },
    required: ['query'],
  },
};
