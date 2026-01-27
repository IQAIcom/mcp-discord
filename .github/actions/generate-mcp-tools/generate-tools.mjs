import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');
const README_PATH = path.join(ROOT, 'README.md');
const TOOL_LIST_PATH = path.join(ROOT, 'src', 'tool-list.ts');

const START = '<!-- AUTO-GENERATED TOOLS START -->';
const END = '<!-- AUTO-GENERATED TOOLS END -->';

/**
 * Load MCP tools from tool-list.ts
 * This project exports tools as a toolList array with inputSchema (JSON Schema)
 */
async function loadTools() {
  const mod = await import(TOOL_LIST_PATH);
  const toolList = mod.toolList;

  if (!Array.isArray(toolList)) {
    throw new Error('toolList is not an array');
  }

  return toolList.sort((a, b) => a.name.localeCompare(b.name));
}

function buildTableRow(key, prop, required, hasDefaults) {
  const type = Array.isArray(prop.type)
    ? prop.type.join(' | ')
    : (prop.type ?? 'unknown');
  const requiredStr = required.has(key) ? '✅' : '';
  const description = prop.description ?? '';
  const defaultVal =
    prop.default !== undefined ? JSON.stringify(prop.default) : '';

  if (hasDefaults) {
    return `| \`${key}\` | ${type} | ${requiredStr} | ${defaultVal} | ${description} |\n`;
  }
  return `| \`${key}\` | ${type} | ${requiredStr} | ${description} |\n`;
}

function renderSchema(inputSchema) {
  if (!inputSchema?.properties) {
    return '_No parameters_';
  }

  const properties = inputSchema.properties;
  const required = new Set(inputSchema.required ?? []);

  if (Object.keys(properties).length === 0) {
    return '_No parameters_';
  }

  const hasDefaults = Object.values(properties).some(
    (prop) => prop.default !== undefined
  );

  let table = hasDefaults
    ? '| Parameter | Type | Required | Default | Description |\n|-----------|------|----------|---------|-------------|\n'
    : '| Parameter | Type | Required | Description |\n|-----------|------|----------|-------------|\n';

  for (const [key, prop] of Object.entries(properties)) {
    table += buildTableRow(key, prop, required, hasDefaults);
  }

  return table.trim();
}

function renderMarkdown(tools) {
  let md = '';

  for (const tool of tools) {
    const schema = tool.inputSchema;

    md += `### \`${tool.name}\`\n`;
    md += `${tool.description}\n\n`;
    md += `${renderSchema(schema)}\n\n`;
  }

  return md.trim();
}

function updateReadme({ readme, tools }) {
  if (!(readme.includes(START) && readme.includes(END))) {
    throw new Error('README missing AUTO-GENERATED TOOLS markers');
  }

  const toolsMd = renderMarkdown(tools);

  return readme.replace(
    new RegExp(`${START}[\\s\\S]*?${END}`, 'm'),
    `${START}\n\n${toolsMd}\n\n${END}`
  );
}

async function main() {
  try {
    const readme = fs.readFileSync(README_PATH, 'utf8');
    const tools = await loadTools();

    if (tools.length === 0) {
      // biome-ignore lint/suspicious/noConsole: CLI script needs console output
      console.warn('Warning: No tools found!');
    }

    const updated = updateReadme({ readme, tools });

    fs.writeFileSync(README_PATH, updated);
    // biome-ignore lint/suspicious/noConsole: CLI script needs console output
    console.log(`Synced ${tools.length} MCP tools to README.md`);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: CLI script needs console output
    console.error('Error updating README:', error);
    process.exit(1);
  }
}

main().catch((err) => {
  // biome-ignore lint/suspicious/noConsole: CLI script needs console output
  console.error(err);
  process.exit(1);
});
