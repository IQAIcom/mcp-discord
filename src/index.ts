#!/usr/bin/env node
import { Client, GatewayIntentBits } from 'discord.js';
import { env } from './config.js';
import { error, info } from './logger.js';
import { DiscordMCPServer } from './server.js';
import { StdioTransport, StreamableHttpTransport } from './transport.js';

// Create Discord client with additional intents for sampling
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ...(env.SAMPLING_ENABLED ? [GatewayIntentBits.DirectMessages] : []),
  ],
});

// Save token to client for login handler
if (env.DISCORD_TOKEN) {
  client.token = env.DISCORD_TOKEN;
}

// Auto-login on startup if token is available
const autoLogin = async () => {
  const token = env.DISCORD_TOKEN;
  if (token) {
    try {
      await client.login(token);
      info('Successfully logged in to Discord');
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (err: any) {
      if (
        typeof err.message === 'string' &&
        err.message.includes(
          'Privileged intent provided is not enabled or whitelisted'
        )
      ) {
        error(
          'Login failed: One or more privileged intents are not enabled in the Discord Developer Portal. Please enable the required intents.'
        );
      } else {
        error(`Auto-login failed: ${String(err)}`);
      }
    }
  } else {
    info('No Discord token found in config, skipping auto-login');
  }
};

// Initialize transport based on configuration
const initializeTransport = () => {
  switch (env.TRANSPORT.toLowerCase()) {
    case 'http':
      info(`Initializing HTTP transport on 0.0.0.0:${env.HTTP_PORT}`);
      return new StreamableHttpTransport(env.HTTP_PORT);
    case 'stdio':
      info('Initializing stdio transport');
      return new StdioTransport();
    default:
      error(`Unknown transport type: ${env.TRANSPORT}. Falling back to stdio.`);
      return new StdioTransport();
  }
};

// Start auto-login process
await autoLogin();

// Create and start MCP server with selected transport
const transport = initializeTransport();
const mcpServer = new DiscordMCPServer(client, transport, {
  samplingEnabled: env.SAMPLING_ENABLED,
});

try {
  await mcpServer.start();
  info('MCP server started successfully');

  if (env.SAMPLING_ENABLED) {
    info('Sampling enabled');
  }

  // Keep the Node.js process running
  if (env.TRANSPORT.toLowerCase() === 'http') {
    // Send a heartbeat every 30 seconds to keep the process alive
    setInterval(() => {
      info('MCP server is running');
    }, 30_000);

    // Handle termination signals
    process.on('SIGINT', async () => {
      info('Received SIGINT. Shutting down server...');
      await mcpServer.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      info('Received SIGTERM. Shutting down server...');
      await mcpServer.stop();
      process.exit(0);
    });

    info('Server running in keep-alive mode. Press Ctrl+C to stop.');
  }
} catch (err) {
  error(`Failed to start MCP server: ${String(err)}`);
  process.exit(1);
}
