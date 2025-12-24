// GDELT API Types

// Article from DOC API
export interface Article {
  url: string;
  url_mobile?: string;
  title: string;
  seendate: string;
  socialimage?: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

// Timeline entry
export interface TimelineEntry {
  date: string;
  value: number;
}

// Timeline series structure (real API response)
export interface TimelineSeries {
  series: string;
  data: TimelineEntry[];
}

// Tone chart entry
export interface ToneChartEntry {
  tone: number;
  count: number;
}

// Tone bin structure (real API response)
export interface ToneBin {
  bin: number;       // -14 to 16
  count: number;
  toparts: Array<{
    url: string;
    title: string;
  }>;
}

// GeoJSON types for GEO API
export interface GeoFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name: string;
    count: number;
    articles?: Article[];
  };
}

export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

// Image metadata
export interface ImageInfo {
  url: string;
  webcount?: number;
  tags?: string[];
  webtags?: string[];
  ocr?: string;
  facetone?: number;
  numfaces?: number;
}

// DOC API request parameters
export interface DocAPIParams {
  query: string;
  mode: string;
  format?: string;
  timespan?: string;
  startdatetime?: string;
  enddatetime?: string;
  maxrecords?: number;
  sort?: string;
  timelinesmooth?: number;
}

// GEO API request parameters
export interface GeoAPIParams {
  query: string;
  mode: string;
  format?: string;
  timespan?: string;
  startdatetime?: string;
  enddatetime?: string;
  maxpoints?: number;
  geores?: number;
  sortby?: string;
}

// API Response types
export interface DocAPIResponse {
  articles?: Article[];
  // Timeline API returns nested structure with query_details
  query_details?: {
    title: string;
    date_resolution: string;
  };
  timeline?: TimelineSeries[];
  // ToneChart returns array of bins directly (not wrapped in object)
  tonechart?: ToneChartEntry[];  // This is for our processed data
  images?: ImageInfo[];
}

export interface GeoAPIResponse extends GeoFeatureCollection {}
