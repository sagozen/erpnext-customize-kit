import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import assert from 'node:assert/strict';

const client = new Client({ name: 'sankaku-kit-protocol-check', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: ['build/index.js'],
  env: { ERPNEXT_URL: 'http://127.0.0.1:9' },
  stderr: 'pipe',
});
try {
  await client.connect(transport);
  const result = await client.listTools();
  const names = result.tools.map(tool => tool.name);
  assert.ok(names.includes('get_doctype_fields'));
  assert.ok(names.includes('get_documents'));
  console.log(JSON.stringify({ handshake: 'passed', toolCount: names.length, tools: names, liveSiteRead: 'not-run' }));
} finally {
  await client.close();
  await transport.close();
}
