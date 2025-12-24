// Geographic Search Tool

import { fetchGeoAPI } from '../gdelt/client.js';
import type { GeoSearchParams } from '../schemas/tool-schemas.js';

/**
 * Search for geographic locations mentioned in news coverage
 */
export async function geoSearch(params: GeoSearchParams) {
  // GDELT GEO API only supports PointData mode for JSON/GeoJSON output
  // Country and ADM1 modes return HTML visualizations only
  const response = await fetchGeoAPI({
    query: params.query,
    mode: 'PointData',
    timespan: params.timespan,
    maxpoints: params.maxpoints,
  });

  const features = response.features || [];

  return {
    content: [
      {
        type: 'text' as const,
        text: `Found ${features.length} geographic locations:\n\n${features
          .slice(0, 20) // Show top 20 in text
          .map(
            (feature, i) =>
              `${i + 1}. ${feature.properties.name} (${feature.properties.count} mentions)\n   Coordinates: [${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}]`
          )
          .join('\n\n')}${features.length > 20 ? '\n\n... and more (see structured data)' : ''}`,
      },
    ],
    structuredContent: {
      type: 'FeatureCollection',
      features,
      count: features.length,
    },
  };
}

export const geoSearchDefinition = {
  name: 'gdelt_geo_search',
  description: 'Geographic search returning GeoJSON data of locations mentioned in news coverage. Limited to last 7 days.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string' as const,
        description: 'Search query',
      },
      timespan: {
        type: 'string' as const,
        description: 'Time window (max 7 days, e.g., 1d, 3d, 7d)',
        default: '1d',
      },
      maxpoints: {
        type: 'number' as const,
        description: 'Maximum number of locations (1-1000)',
        default: 100,
      },
    },
    required: ['query'],
  },
};
