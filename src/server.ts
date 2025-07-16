import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { Client } from 'discord.js';
import { error, info } from './logger.js';
import { SamplingHandler } from './sampling.js';
import { toolList } from './tool-list.js';
import {
  addMultipleReactionsHandler,
  addReactionHandler,
  createCategoryHandler,
  createForumPostHandler,
  createTextChannelHandler,
  createToolContext,
  createWebhookHandler,
  deleteCategoryHandler,
  deleteChannelHandler,
  deleteForumPostHandler,
  deleteMessageHandler,
  deleteWebhookHandler,
  editCategoryHandler,
  editWebhookHandler,
  getForumChannelsHandler,
  getForumPostHandler,
  getServerInfoHandler,
  loginHandler,
  readMessagesHandler,
  removeReactionHandler,
  replyToForumHandler,
  sendMessageHandler,
  sendWebhookMessageHandler,
} from './tools/tools.js';
import type { ToolResponse } from './tools/types.js';
import type { MCPTransport } from './transport.js';

export class DiscordMCPServer {
  private server: Server;
  private toolContext: ReturnType<typeof createToolContext>;
  private clientStatusInterval: NodeJS.Timeout | null = null;
  private samplingHandler: SamplingHandler | null = null;

  private client: Client;
  private transport: MCPTransport;

  constructor(
    client: Client,
    transport: MCPTransport,
    options: { samplingEnabled?: boolean } = {}
  ) {
    this.client = client;
    this.transport = transport;

    this.server = new Server(
      {
        name: 'MCP-Discord',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          ...(options.samplingEnabled && { sampling: {} }),
        },
      }
    );

    this.toolContext = createToolContext(client);
    this.setupHandlers();

    // Initialize sampling handler if enabled
    if (options.samplingEnabled) {
      this.samplingHandler = new SamplingHandler(client, this.server);
    }
  }

  private setupHandlers() {
    // Set up the tool list
    this.server.setRequestHandler(ListToolsRequestSchema, () => ({
      tools: toolList,
    }));

    // Handle tool execution requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let toolResponse: ToolResponse;
        switch (name) {
          case 'discord_create_category':
            toolResponse = await createCategoryHandler(args, this.toolContext);
            return toolResponse;
          case 'discord_edit_category':
            toolResponse = await editCategoryHandler(args, this.toolContext);
            return toolResponse;
          case 'discord_delete_category':
            toolResponse = await deleteCategoryHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_login':
            toolResponse = await loginHandler(args, this.toolContext);
            this.logClientState('after discord_login handler');
            return toolResponse;

          case 'discord_send':
            this.logClientState('before discord_send handler');
            toolResponse = await sendMessageHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_get_forum_channels':
            this.logClientState('before discord_get_forum_channels handler');
            toolResponse = await getForumChannelsHandler(
              args,
              this.toolContext
            );
            return toolResponse;

          case 'discord_create_forum_post':
            this.logClientState('before discord_create_forum_post handler');
            toolResponse = await createForumPostHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_get_forum_post':
            this.logClientState('before discord_get_forum_post handler');
            toolResponse = await getForumPostHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_reply_to_forum':
            this.logClientState('before discord_reply_to_forum handler');
            toolResponse = await replyToForumHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_delete_forum_post':
            this.logClientState('before discord_delete_forum_post handler');
            toolResponse = await deleteForumPostHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_create_text_channel':
            this.logClientState('before discord_create_text_channel handler');
            toolResponse = await createTextChannelHandler(
              args,
              this.toolContext
            );
            return toolResponse;

          case 'discord_delete_channel':
            this.logClientState('before discord_delete_channel handler');
            toolResponse = await deleteChannelHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_read_messages':
            this.logClientState('before discord_read_messages handler');
            toolResponse = await readMessagesHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_get_server_info':
            this.logClientState('before discord_get_server_info handler');
            toolResponse = await getServerInfoHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_add_reaction':
            this.logClientState('before discord_add_reaction handler');
            toolResponse = await addReactionHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_add_multiple_reactions':
            this.logClientState(
              'before discord_add_multiple_reactions handler'
            );
            toolResponse = await addMultipleReactionsHandler(
              args,
              this.toolContext
            );
            return toolResponse;

          case 'discord_remove_reaction':
            this.logClientState('before discord_remove_reaction handler');
            toolResponse = await removeReactionHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_delete_message':
            this.logClientState('before discord_delete_message handler');
            toolResponse = await deleteMessageHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_create_webhook':
            this.logClientState('before discord_create_webhook handler');
            toolResponse = await createWebhookHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_send_webhook_message':
            this.logClientState('before discord_send_webhook_message handler');
            toolResponse = await sendWebhookMessageHandler(
              args,
              this.toolContext
            );
            return toolResponse;

          case 'discord_edit_webhook':
            this.logClientState('before discord_edit_webhook handler');
            toolResponse = await editWebhookHandler(args, this.toolContext);
            return toolResponse;

          case 'discord_delete_webhook':
            this.logClientState('before discord_delete_webhook handler');
            toolResponse = await deleteWebhookHandler(args, this.toolContext);
            return toolResponse;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (err) {
        error(`Error in tool handler: ${String(err)}`);
        throw err;
      }
    });
  }

  private logClientState(context: string) {
    info(
      `Discord client state [${context}]: ${JSON.stringify({
        isReady: this.client.isReady(),
        hasToken: !!this.client.token,
        user: this.client.user
          ? {
              id: this.client.user.id,
              tag: this.client.user.tag,
            }
          : null,
      })}`
    );
  }

  async start() {
    // Add client to server context so transport can access it
    // biome-ignore lint/suspicious/noExplicitAny: <>
    (this.server as any)._context = { client: this.client };
    // biome-ignore lint/suspicious/noExplicitAny: <>
    (this.server as any).client = this.client;

    // Setup periodic client state logging
    this.clientStatusInterval = setInterval(() => {
      this.logClientState('periodic check');
    }, 10_000);

    // Enable sampling if handler is available
    if (this.samplingHandler) {
      this.samplingHandler.enable();
    }

    await this.transport.start(this.server);

    if (this.samplingHandler) {
      info('MCP Discord server started with sampling enabled');
    } else {
      info('MCP Discord server started (sampling disabled)');
    }
  }

  async stop() {
    if (this.clientStatusInterval) {
      clearInterval(this.clientStatusInterval);
    }

    // Disable sampling if handler is available
    if (this.samplingHandler) {
      this.samplingHandler.disable();
    }

    await this.transport.stop();
    info('MCP Discord server stopped');
  }
}
