#!/usr/bin/env node

// src/index.ts
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "node-fetch";
var server = new McpServer({
  name: "Walrus TS MCP Server",
  version: "1.0.0"
});
server.tool("get_sui_price", {}, async ({}) => {
  const sui_price = await fetchSuiPrice();
  return {
    content: [{ type: "text", text: String(sui_price) }]
  };
});
async function fetchSuiPrice() {
  const url = "https://api.binance.com/api/v3/ticker/price?symbol=SUIUSDT";
  const response = await fetch(url);
  if (!response.ok)
    return null;
  const data = await response.json();
  return data.price;
}
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: void 0 }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `Hello, ${name}!`
    }]
  })
);
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch(
  (error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  }
);
