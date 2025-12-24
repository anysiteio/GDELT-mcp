// MCP Server Setup

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { searchArticles, searchArticlesDefinition } from './tools/search-articles.js';
import { getTimeline, timelineDefinition } from './tools/timeline.js';
import { getToneChart, toneChartDefinition } from './tools/tone-chart.js';
import { geoSearch, geoSearchDefinition } from './tools/geo-search.js';
import { imageSearch, imageSearchDefinition } from './tools/image-search.js';
import { monitor, monitorDefinition } from './tools/monitor.js';

import {
  SearchArticlesSchema,
  TimelineSchema,
  ToneChartSchema,
  GeoSearchSchema,
  ImageSearchSchema,
  MonitorSchema,
} from './schemas/tool-schemas.js';

// Create MCP server
const server = new Server(
  {
    name: 'gdelt-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      searchArticlesDefinition,
      timelineDefinition,
      toneChartDefinition,
      geoSearchDefinition,
      imageSearchDefinition,
      monitorDefinition,
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'gdelt_search_articles': {
        const params = SearchArticlesSchema.parse(args);
        return await searchArticles(params);
      }

      case 'gdelt_timeline': {
        const params = TimelineSchema.parse(args);
        return await getTimeline(params);
      }

      case 'gdelt_tone_chart': {
        const params = ToneChartSchema.parse(args);
        return await getToneChart(params);
      }

      case 'gdelt_geo_search': {
        const params = GeoSearchSchema.parse(args);
        return await geoSearch(params);
      }

      case 'gdelt_image_search': {
        const params = ImageSearchSchema.parse(args);
        return await imageSearch(params);
      }

      case 'gdelt_monitor': {
        const params = MonitorSchema.parse(args);
        return await monitor(params);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
    throw error;
  }
});

// Start server
export async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GDELT MCP Server running on stdio');
}
