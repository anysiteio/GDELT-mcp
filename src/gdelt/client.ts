// GDELT API Client

import type {
  DocAPIParams,
  GeoAPIParams,
  DocAPIResponse,
  GeoAPIResponse,
} from './types.js';
import { buildQueryString } from './utils.js';

const DOC_API_URL = 'https://api.gdeltproject.org/api/v2/doc/doc';
const GEO_API_URL = 'https://api.gdeltproject.org/api/v2/geo/geo';

/**
 * Fetch data from GDELT DOC 2.0 API
 */
export async function fetchDocAPI(
  params: DocAPIParams
): Promise<DocAPIResponse> {
  // Always use JSON format
  const requestParams = {
    ...params,
    format: 'json',
  };

  const queryString = buildQueryString(requestParams);
  const url = `${DOC_API_URL}?${queryString}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GDELT-MCP-Server/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(
        `GDELT DOC API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json() as DocAPIResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch from GDELT DOC API: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fetch data from GDELT GEO 2.0 API
 */
export async function fetchGeoAPI(
  params: GeoAPIParams
): Promise<GeoAPIResponse> {
  // Always use GeoJSON format (case-sensitive!)
  const requestParams = {
    ...params,
    format: 'GeoJSON',
  };

  const queryString = buildQueryString(requestParams);
  const url = `${GEO_API_URL}?${queryString}`;

  // Debug: log the URL being called
  console.error('[GDELT GEO] Fetching:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GDELT-MCP-Server/1.0',
      },
    });
    console.error('[GDELT GEO] Status:', response.status, 'Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      throw new Error(
        `GDELT GEO API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json() as GeoAPIResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch from GDELT GEO API: ${error.message}`);
    }
    throw error;
  }
}
