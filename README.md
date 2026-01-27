# 💬 Discord MCP Server

[![npm version](https://img.shields.io/npm/v/@iqai/mcp-discord.svg)](https://www.npmjs.com/package/@iqai/mcp-discord)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

The Discord MCP Server enables AI agents to interact with the Discord platform through the Model Context Protocol (MCP). This server provides comprehensive access to Discord's features including messaging, channel management, forum operations, reactions, and webhook management.

By implementing MCP, this server allows Large Language Models (LLMs) to read and send messages, manage channels and forums, handle reactions, and interact with webhooks directly through their context window, bridging the gap between AI and Discord communities.

The server supports bi-directional communication through a Sampling feature, allowing the bot to listen to messages and respond automatically when mentioned.

## Features

*   **Message Management**: Send, read, and delete messages in Discord channels
*   **Channel Operations**: Create and delete text channels with custom topics
*   **Forum Support**: Create, read, reply to, and delete forum posts with tag support
*   **Reaction Handling**: Add single or multiple reactions to messages
*   **Webhook Integration**: Create, edit, delete, and send messages via webhooks
*   **Server Information**: Retrieve detailed server information including channels and member counts

## Installation

### Using npx (Recommended)

To use this server without installing it globally:

```bash
npx @iqai/mcp-discord --config ${DISCORD_TOKEN}
```

### Build from Source

```bash
git clone https://github.com/IQAIcom/mcp-discord.git
cd mcp-discord
pnpm install
pnpm run build
```

## Running with an MCP Client

Add the following configuration to your MCP client settings (e.g., `claude_desktop_config.json`).

### Minimal Configuration

```json
{
  "mcpServers": {
    "discord": {
      "command": "npx",
      "args": ["-y", "@iqai/mcp-discord", "--config", "YOUR_DISCORD_TOKEN"]
    }
  }
}
```

### Advanced Configuration (Local Build)

```json
{
  "mcpServers": {
    "discord": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-discord/dist/index.js"],
      "env": {
        "DISCORD_TOKEN": "your_discord_bot_token",
        "SAMPLING_ENABLED": "true",
        "TRANSPORT": "stdio"
      }
    }
  }
}
```

## Configuration (Environment Variables)

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `DISCORD_TOKEN` | Yes | Discord bot token from the Developer Portal | - |
| `SAMPLING_ENABLED` | No | Enables bi-directional message sampling | `true` |
| `TRANSPORT` | No | Transport method: `stdio` or `http` | `stdio` |
| `HTTP_PORT` | No | Port for HTTP transport | `8080` |
| `DEFAULT_RATE_LIMIT_SECONDS` | No | Rate limit (seconds) for sampling requests per user | `2` |
| `DEFAULT_MESSAGE_CHUNK_SIZE` | No | Max message chunk size for sampling responses | `2000` |
| `RESPOND_TO_MENTIONS_ONLY` | No | Only respond to messages that mention the bot | `true` |
| `BLOCK_DMS` | No | Block direct messages to the bot | `true` |
| `BLOCKED_GUILDS` | No | Comma-separated list of guild IDs to block | `""` |
| `BANNED_USERS` | No | Comma-separated list of user IDs to ban | `""` |
| `REACTION_SAMPLING_ENABLED` | No | Enable AI-generated contextual reactions | `false` |
| `REACTION_TIMEOUT_MS` | No | Timeout (ms) for reaction sampling requests | `3000` |
| `REACTION_FALLBACK_EMOJI` | No | Fallback emoji when reaction sampling fails | `"🤔"` |

## Prerequisites

Before using this MCP server, you need:

1. A Discord bot with appropriate permissions from the [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable these intents: Message Content, Server Members, Presence
3. Add the bot to your server with required permissions (Administrator recommended, or specific permissions for channels, messages, webhooks)

## Usage Examples

### Message Operations
*   "Send a message to channel #general saying 'Hello everyone!'"
*   "Read the last 10 messages from the announcements channel"
*   "Delete the message with ID 123456789 from #spam-channel"

### Channel Management
*   "Create a new text channel called 'project-updates' with topic 'Project status updates'"
*   "Delete the channel #old-channel"
*   "Get all the server information including channel list"

### Forum Operations
*   "List all forum channels in this server"
*   "Create a new forum post titled 'Feature Request' with content about the new feature"
*   "Reply to the forum post about bugs with a status update"

### Reaction Handling
*   "Add a thumbs up reaction to the latest message in #feedback"
*   "Add multiple reactions (🎉 🚀 ✅) to the announcement message"
*   "Remove my reaction from that message"

### Webhook Management
*   "Create a webhook named 'Notifications Bot' in #alerts channel"
*   "Send a message via webhook to post as 'System Alert'"
*   "Delete the unused webhook from #old-notifications"

## MCP Tools

<!-- AUTO-GENERATED TOOLS START -->

### `discord_add_multiple_reactions`
Adds multiple emoji reactions to a Discord message at once

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channelId` | string | ✅ |  |
| `messageId` | string | ✅ |  |
| `emojis` | array | ✅ |  |

### `discord_add_reaction`
Adds an emoji reaction to a specific Discord message

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channelId` | string | ✅ |  |
| `messageId` | string | ✅ |  |
| `emoji` | string | ✅ |  |

### `discord_create_category`
Creates a new category in a Discord server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guildId` | string | ✅ |  |
| `name` | string | ✅ |  |
| `position` | number |  |  |
| `reason` | string |  |  |

### `discord_create_forum_post`
Creates a new post in a Discord forum channel with optional tags

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `forumChannelId` | string | ✅ |  |
| `title` | string | ✅ |  |
| `content` | string | ✅ |  |
| `tags` | array |  |  |

### `discord_create_text_channel`
Creates a new text channel in a Discord server with an optional topic

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guildId` | string | ✅ |  |
| `channelName` | string | ✅ |  |
| `topic` | string |  |  |

### `discord_create_webhook`
Creates a new webhook for a Discord channel

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channelId` | string | ✅ |  |
| `name` | string | ✅ |  |
| `avatar` | string |  |  |
| `reason` | string |  |  |

### `discord_delete_category`
Deletes a Discord category by ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | string | ✅ |  |
| `reason` | string |  |  |

### `discord_delete_channel`
Deletes a Discord channel with an optional reason

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channelId` | string | ✅ |  |
| `reason` | string |  |  |

### `discord_delete_forum_post`
Deletes a forum post or thread with an optional reason

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `threadId` | string | ✅ |  |
| `reason` | string |  |  |

### `discord_delete_message`
Deletes a specific message from a Discord text channel

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channelId` | string | ✅ |  |
| `messageId` | string | ✅ |  |
| `reason` | string |  |  |

### `discord_delete_webhook`
Deletes an existing webhook for a Discord channel

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhookId` | string | ✅ |  |
| `webhookToken` | string |  |  |
| `reason` | string |  |  |

### `discord_edit_category`
Edits an existing Discord category (name and position).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | string | ✅ |  |
| `name` | string |  |  |
| `position` | number |  |  |
| `reason` | string |  |  |

### `discord_edit_webhook`
Edits an existing webhook for a Discord channel

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhookId` | string | ✅ |  |
| `webhookToken` | string |  |  |
| `name` | string |  |  |
| `avatar` | string |  |  |
| `channelId` | string |  |  |
| `reason` | string |  |  |

### `discord_get_forum_channels`
Lists all forum channels in a specified Discord server (guild)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guildId` | string | ✅ |  |

### `discord_get_forum_post`
Retrieves details about a forum post including its messages

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `threadId` | string | ✅ |  |

### `discord_get_server_info`
Retrieves detailed information about a Discord server including channels and member count

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guildId` | string | ✅ |  |

### `discord_login`
Logs in to Discord using the configured token

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string |  |  |

### `discord_read_messages`
Retrieves messages from a Discord text channel with a configurable limit

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `channelId` | string | ✅ |  |  |
| `limit` | number |  | 50 |  |

### `discord_remove_reaction`
Removes a specific emoji reaction from a Discord message

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channelId` | string | ✅ |  |
| `messageId` | string | ✅ |  |
| `emoji` | string | ✅ |  |
| `userId` | string |  |  |

### `discord_reply_to_forum`
Adds a reply to an existing forum post or thread

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `threadId` | string | ✅ |  |
| `message` | string | ✅ |  |

### `discord_send`
Sends a message to a specified Discord text channel

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channelId` | string | ✅ |  |
| `message` | string | ✅ |  |

### `discord_send_webhook_message`
Sends a message to a Discord channel using a webhook

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhookId` | string | ✅ |  |
| `webhookToken` | string | ✅ |  |
| `content` | string | ✅ |  |
| `username` | string |  |  |
| `avatarURL` | string |  |  |
| `threadId` | string |  |  |

<!-- AUTO-GENERATED TOOLS END -->

## Development

### Build Project
```bash
pnpm run build
```

### Development Mode (Watch)
```bash
pnpm run watch
```

### Linting & Formatting
```bash
pnpm run lint
pnpm run format
```

### Project Structure
*   `src/tools/`: Individual tool handlers
*   `src/tool-list.ts`: MCP tool definitions
*   `src/schemas.ts`: Zod validation schemas
*   `src/sampling.ts`: Bi-directional sampling feature
*   `src/index.ts`: Server entry point

## Resources

*   [Discord Developer Portal](https://discord.com/developers/applications)
*   [Discord.js Documentation](https://discord.js.org/)
*   [Model Context Protocol (MCP)](https://modelcontextprotocol.io)

## Disclaimer

This project is an unofficial tool and is not directly affiliated with Discord Inc. Users are responsible for ensuring their bot usage complies with Discord's Terms of Service and Developer Terms.

## License

[MIT](LICENSE)
