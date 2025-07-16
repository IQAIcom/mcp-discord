import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { type Client, Events, type Message } from 'discord.js';
import { z } from 'zod';
import { env } from './config.js';
import { error, info } from './logger.js';

// Rate limiting for sampling requests
const userCooldowns = new Map<string, number>();
const COOLDOWN_MS = env.DEFAULT_RATE_LIMIT_SECONDS * 1000;

export class SamplingHandler {
  private client: Client;
  private server: Server;
  private isEnabled = false;

  constructor(client: Client, server: Server) {
    this.client = client;
    this.server = server;
  }

  enable() {
    if (this.isEnabled) {
      return;
    }

    this.isEnabled = true;
    this.setupEventListeners();
    info('Sampling handlers initialized');
  }

  disable() {
    if (!this.isEnabled) {
      return;
    }

    this.isEnabled = false;
    this.removeEventListeners();
    info('Sampling handlers disabled');
  }

  private setupEventListeners() {
    // Set up Discord message event listener for sampling
    this.client.on(Events.MessageCreate, this.handleMessage);

    // Handle bot mentions specifically
    this.client.on(Events.MessageCreate, this.handleBotMention);
  }

  private removeEventListeners() {
    this.client.off(Events.MessageCreate, this.handleMessage);
    this.client.off(Events.MessageCreate, this.handleBotMention);
  }

  private handleMessage = async (message: Message) => {
    if (message.author.bot) {
      return;
    }

    await this.handleMessageForSampling(message);
  };

  private handleBotMention = async (message: Message) => {
    if (message.author.bot) {
      return;
    }
    if (!(this.client.user && message.mentions.has(this.client.user))) {
      return;
    }

    await this.addThinkingReaction(message);
  };

  private async handleMessageForSampling(message: Message) {
    const userId = message.author.id;
    const now = Date.now();
    const lastMessage = userCooldowns.get(userId) || 0;

    if (now - lastMessage < COOLDOWN_MS) {
      return;
    }

    userCooldowns.set(userId, now);

    try {
      const template = this.createMessageTemplate(message);

      if (message.channel.isTextBased() && 'sendTyping' in message.channel) {
        await message.channel.sendTyping();
      }

      const result = await this.requestSampling(template);

      if (result?.content?.text) {
        await this.sendSamplingResponse(message, result.content.text);
      }
    } catch (err) {
      error(`Error processing sampling request: ${String(err)}`);
      if (message.channel.isTextBased() && 'send' in message.channel) {
        await message.channel
          .send(
            '💥 Oops! Something went wrong. My brain.exe has stopped working.'
          )
          .catch(() => {
            // Ignore send errors in error handler
          });
      }
    }
  }

  private async addThinkingReaction(message: Message) {
    try {
      await message.react('🤔');
    } catch {
      // Ignore reaction errors
    }
  }

  private createMessageTemplate(message: Message): string {
    return `
      MESSAGE FROM USER:
      user_id: ${message.author.id}
      user_name: ${message.author.username}
      user_display_name: ${message.author.displayName}
      guild_name: ${message.guild?.name || 'Direct Message'}
      channel_name: ${message.channel.type === 0 ? message.channel.name : 'DM'}
      message: ${message.content}
      timestamp: ${message.createdAt.toISOString()}
    `.trim();
  }

  private async requestSampling(template: string) {
    return await this.server.request(
      {
        method: 'sampling/createMessage',
        params: {
          messages: [
            {
              role: 'user',
              content: { type: 'text', text: template },
            },
          ],
          maxTokens: 200,
        },
      },
      z.any()
    );
  }

  private async sendSamplingResponse(message: Message, response: string) {
    if (!(message.channel.isTextBased() && 'send' in message.channel)) {
      return;
    }

    if (response.length > env.DEFAULT_MESSAGE_CHUNK_SIZE) {
      const chunks = response.match(
        new RegExp(`.{1,${env.DEFAULT_MESSAGE_CHUNK_SIZE}}`, 'g')
      ) || [response];
      // Send chunks sequentially to maintain message order
      for (const chunk of chunks) {
        // biome-ignore lint: Sequential sending required for Discord message order
        await message.channel.send(chunk);
      }
    } else {
      await message.channel.send(response);
    }
  }
}
