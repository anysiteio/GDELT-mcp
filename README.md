# GDELT MCP Server

Model Context Protocol (MCP) server for integrating with the GDELT (Global Database of Events, Language, and Tone) API. Provides access to global news coverage, sentiment analysis, geographic data, and visual content through 6 core tools.

## Features

- **No Authentication Required** - GDELT APIs are completely open
- **Real-time Data** - Updated every 15 minutes
- **6 Core Tools**:
  - Search articles with advanced filters
  - Timeline analysis (volume, tone, language, source country)
  - Sentiment/tone distribution
  - Geographic search with GeoJSON output
  - Visual content search
  - Real-time news monitoring

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Running

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Configuration for Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gdelt": {
      "command": "node",
      "args": ["/absolute/path/to/GDELT-mcp/dist/index.js"]
    }
  }
}
```

After updating the config, restart Claude Desktop.

## Available Tools

### 1. gdelt_search_articles

Search for news articles with advanced filtering.

**Parameters:**
- `query` (required): Search query with operators
- `timespan` (optional, default: "3d"): Time window (15min, 2h, 3d, 1w, 2m)
- `maxrecords` (optional, default: 75): Maximum results (1-250)
- `sort` (optional, default: "DateDesc"): Sort order

**Query Operators:**
- `"phrase"` - Exact phrase match
- `domain:cnn.com` - Filter by domain
- `sourcecountry:russia` - Filter by source country
- `sourcelang:spanish` - Filter by language
- `tone<-5` - Negative sentiment filter
- `theme:TERROR` - Filter by GKG theme

**Example:**
```
query: "climate change" sourcecountry:us
timespan: 1w
maxrecords: 100
```

### 2. gdelt_timeline

Get timeline analysis showing trends over time.

**Parameters:**
- `query` (required): Search query
- `timespan` (optional, default: "1w"): Time window
- `timeline_type` (optional, default: "volume"): Type of analysis
  - `volume`: Coverage volume over time
  - `tone`: Average sentiment over time
  - `language`: Distribution by language
  - `sourcecountry`: Distribution by source country

**Example:**
```
query: "artificial intelligence"
timespan: 2w
timeline_type: tone
```

### 3. gdelt_tone_chart

Get sentiment distribution histogram.

**Parameters:**
- `query` (required): Search query
- `timespan` (optional, default: "3d"): Time window

**Example:**
```
query: "presidential election"
timespan: 7d
```

### 4. gdelt_geo_search

Geographic search returning GeoJSON data.

**Parameters:**
- `query` (required): Search query
- `timespan` (optional, default: "1d"): Time window (max 7 days)
- `output_mode` (optional, default: "point"): Aggregation mode
  - `point`: Individual locations
  - `country`: Aggregated by country
  - `adm1`: Aggregated by admin division
- `maxpoints` (optional, default: 100): Maximum locations (1-1000)

**Example:**
```
query: "earthquake"
timespan: 3d
output_mode: country
```

### 5. gdelt_image_search

Search for images using Visual Knowledge Graph.

**Parameters:**
- `query` (required): Search query with image operators
- `timespan` (optional, default: "3d"): Time window
- `maxrecords` (optional, default: 75): Maximum images (1-250)

**Image Operators:**
- `imagetag:"flood"` - Deep learning detected objects
- `imagewebtag:"election"` - Crowdsourced captions
- `imageocrmeta:"protest"` - OCR + EXIF metadata
- `imagefacetone<-1.5` - Facial emotion
- `imagenumfaces>3` - Number of faces

**Example:**
```
query: imagetag:"protest" imagenumfaces>5
timespan: 1w
```

### 6. gdelt_monitor

Monitor real-time news coverage.

**Parameters:**
- `query` (required): Search query
- `interval` (optional, default: "15min"): Monitoring interval
  - `15min`: Last 15 minutes
  - `1h`: Last hour
  - `3h`: Last 3 hours

**Example:**
```
query: "breaking news" domain:cnn.com
interval: 15min
```

## GDELT API Limits

- **DOC API**: Last 3 months, max 250 results per request
- **GEO API**: Last 7 days, max 1000 points
- **Update Frequency**: Every 15 minutes
- **Rate Limits**: None (use responsibly)

## Project Structure

```
GDELT-mcp/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # MCP server setup
│   ├── tools/                # Tool implementations
│   │   ├── search-articles.ts
│   │   ├── timeline.ts
│   │   ├── tone-chart.ts
│   │   ├── geo-search.ts
│   │   ├── image-search.ts
│   │   └── monitor.ts
│   ├── gdelt/                # GDELT API client
│   │   ├── client.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   └── schemas/              # Zod validation schemas
│       └── tool-schemas.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Resources

- [GDELT Documentation](http://data.gdeltproject.org/api/v2/guides/LOOKUP-GKGTHEMES.TXT)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## License

MIT
