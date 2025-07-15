import { handleDiscordError } from '../error-handler.js';
import {
  CreateWebhookSchema,
  DeleteWebhookSchema,
  EditWebhookSchema,
  SendWebhookMessageSchema,
} from '../schemas.js';
import type { ToolContext, ToolResponse } from './types.js';

// Create webhook handler
export async function createWebhookHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { channelId, name, avatar, reason } = CreateWebhookSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: 'text', text: 'Discord client not logged in.' }],
        isError: true,
      };
    }

    const channel = await context.client.channels.fetch(channelId);
    if (!channel?.isTextBased()) {
      return {
        content: [
          {
            type: 'text',
            text: `Cannot find text channel with ID: ${channelId}`,
          },
        ],
        isError: true,
      };
    }

    // Check if the channel supports webhooks
    if (!('createWebhook' in channel)) {
      return {
        content: [
          {
            type: 'text',
            text: `Channel type does not support webhooks: ${channelId}`,
          },
        ],
        isError: true,
      };
    }

    // Create the webhook
    const webhook = await channel.createWebhook({
      name,
      avatar,
      reason,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Successfully created webhook with ID: ${webhook.id} and token: ${webhook.token}`,
        },
      ],
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Send webhook message handler
export async function sendWebhookMessageHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { webhookId, webhookToken, content, username, avatarURL, threadId } =
    SendWebhookMessageSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: 'text', text: 'Discord client not logged in.' }],
        isError: true,
      };
    }

    const webhook = await context.client.fetchWebhook(webhookId, webhookToken);
    if (!webhook) {
      return {
        content: [
          { type: 'text', text: `Cannot find webhook with ID: ${webhookId}` },
        ],
        isError: true,
      };
    }

    // Send the message
    await webhook.send({
      content,
      username,
      avatarURL,
      threadId,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Successfully sent webhook message to webhook ID: ${webhookId}`,
        },
      ],
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Edit webhook handler
export async function editWebhookHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { webhookId, webhookToken, name, avatar, channelId, reason } =
    EditWebhookSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: 'text', text: 'Discord client not logged in.' }],
        isError: true,
      };
    }

    const webhook = await context.client.fetchWebhook(webhookId, webhookToken);
    if (!webhook) {
      return {
        content: [
          { type: 'text', text: `Cannot find webhook with ID: ${webhookId}` },
        ],
        isError: true,
      };
    }

    // Edit the webhook
    await webhook.edit({
      name,
      avatar,
      channel: channelId,
      reason,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Successfully edited webhook with ID: ${webhook.id}`,
        },
      ],
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Delete webhook handler
export async function deleteWebhookHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { webhookId, webhookToken, reason } = DeleteWebhookSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: 'text', text: 'Discord client not logged in.' }],
        isError: true,
      };
    }

    const webhook = await context.client.fetchWebhook(webhookId, webhookToken);
    if (!webhook) {
      return {
        content: [
          { type: 'text', text: `Cannot find webhook with ID: ${webhookId}` },
        ],
        isError: true,
      };
    }

    // Delete the webhook
    await webhook.delete(reason || 'Webhook deleted via API');

    return {
      content: [
        {
          type: 'text',
          text: `Successfully deleted webhook with ID: ${webhook.id}`,
        },
      ],
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}
