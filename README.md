# MCP-Discord

A Discord MCP (Model Context Protocol) server that enables AI assistants to interact with the Discord platform.

## Overview

MCP-Discord provides the following Discord-related functionalities:

- Login to Discord bot
- Get server information
- Read/delete channel messages
- Send messages to specified channels (using either channel IDs or channel names)
- Retrieve forum channel lists
- Create/delete/reply to forum posts
- Create/delete text channels
- Add/remove message reactions
- Create/edit/delete/use webhooks

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Tools Documentation](#tools-documentation)
  - [Basic Functions](#basic-functions)
  - [Channel Management](#channel-management)
  - [Forum Functions](#forum-functions)
  - [Messages and Reactions](#messages-and-reactions)
  - [Webhook Management](#webhook-management)
- [Development](#development)

## Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- A Discord bot with appropriate permissions
  - Bot token (obtainable from the [Discord Developer Portal](https://discord.com/developers/applications))
  - Message Content Intent enabled
  - Server Members Intent enabled
  - Presence Intent enabled
- Permissions required in your Discord server:

  ### Easiest Setup

  - Administrator (Recommended for quick setup and full functionality)

  #### Or, select only the required permissions

  - Send Messages
  - Create Public Threads
  - Send Messages in Threads
  - Manage Messages
  - Manage Threads
  - Manage Channels
  - Manage Webhooks
  - Add Reactions
  - View Channel

- Add your Discord bot to your server
  - To add your Discord bot to your server, use one of the following invite links (replace `INSERT_CLIENT_ID_HERE` with your bot's client ID):
    - **Administrator (full access):**
        <https://discord.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=8>
    - **Custom permissions (minimum required):**
        <https://discord.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=52076489808>

> **Note:**  
> According to Discord's security model, a bot can only access information from servers it has been explicitly added to.  
> If you want to use this MCP server to access a specific Discord server, you must add the bot to that server first.  
> Use the invite link below to add the bot to your target server.

## Installation

### Installing via NPM

You can use it with the following command:

```bash
npx mcp-discord --config ${DISCORD_TOKEN}
```

For more details, you can check out the [NPM Package](https://www.npmjs.com/package/mcp-discord).

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/IQAICOM/mcp-discord.git
cd mcp-discord

# Install dependencies
npm install

# Compile TypeScript
npm run build
```

## Configuration

All configuration is now handled via the `src/config.ts` file, which supports both environment variables and command-line arguments. The following options are available:

| Option                        | Type     | Default   | Description                                                                 |
|-------------------------------|----------|-----------|-----------------------------------------------------------------------------|
| `DISCORD_TOKEN`               | string   | —         | **Required.** Discord bot token.                                            |
| `SAMPLING_ENABLED`            | boolean  | `true`    | Enables bi-directional message sampling (see [Sampling](#sampling)).        |
| `TRANSPORT`                   | string   | `stdio`   | Transport method: `stdio` (default) or `http`.                              |
| `HTTP_PORT`                   | number   | `8080`    | Port for HTTP transport (only if `TRANSPORT` is `http`).                    |
| `DEFAULT_RATE_LIMIT_SECONDS`  | number   | `2`       | Rate limit (seconds) for sampling requests per user.                        |
| `DEFAULT_MESSAGE_CHUNK_SIZE`  | number   | `2000`    | Max message chunk size for sampling responses.                              |
| `RESPOND_TO_MENTIONS_ONLY`    | boolean  | `true`    | Only respond to messages that mention the bot.                              |
| `BLOCK_DMS`                   | boolean  | `true`    | Block direct messages to the bot.                                           |
| `BLOCKED_GUILDS`              | string   | `""`      | Comma-separated list of guild IDs to block.                                 |
| `BANNED_USERS`                | string   | `""`      | Comma-separated list of user IDs to ban.                                    |
| `REACTION_TIMEOUT_MS`         | number   | `3000`    | Timeout (ms) for reaction sampling requests.                                |
| `REACTION_SAMPLING_ENABLED`   | boolean  | `false`   | Enable AI-generated contextual reactions when bot is mentioned.             |
| `REACTION_FALLBACK_EMOJI`     | string   | `"🤔"`    | Fallback emoji when reaction sampling times out or fails.                   |

You can set these options via environment variables or command-line arguments:

**Environment variables:**

```bash
DISCORD_TOKEN=your_discord_bot_token
SAMPLING_ENABLED=false
TRANSPORT=http
HTTP_PORT=3000
DEFAULT_RATE_LIMIT_SECONDS=5
DEFAULT_MESSAGE_CHUNK_SIZE=1500
RESPOND_TO_MENTIONS_ONLY=true
BLOCK_DMS=true
BLOCKED_GUILDS="123456789,987654321"
BANNED_USERS="111111111,222222222"
REACTION_TIMEOUT_MS=3000
REACTION_SAMPLING_ENABLED=true
REACTION_FALLBACK_EMOJI="👍"
```

**Command-line arguments:**

```bash
node build/index.js --config "your_discord_bot_token" --sampling --transport http --port 3000 --rate-limit 5 --message-chunk-size 1500 --mentions-only --block-dms --blocked-guilds "123,456" --banned-users "111,222" --reaction-timeout 3000 --enable-reaction-sampling --reaction-fallback-emoji "👍"
```

If both are provided, command-line arguments take precedence.

---

## Sampling

The Sampling feature enables bi-directional communication between Discord and the MCP server, allowing the bot to listen to messages and respond automatically. This is controlled by the `SAMPLING_ENABLED` config option (enabled by default).

**How it works:**

- When enabled, the bot listens for new messages and bot mentions in Discord channels.
- If a user sends a message, the bot can process it and respond using the MCP protocol.
- When mentioned, the bot can optionally request an AI-generated contextual reaction emoji (disabled by default, enable with `REACTION_SAMPLING_ENABLED=true`).
- All bot responses are sent as **replies** to the original message for better context.
- Rate limiting is enforced per user (see `DEFAULT_RATE_LIMIT_SECONDS`).
- Long responses are split into chunks (see `DEFAULT_MESSAGE_CHUNK_SIZE`).

**Disabling Sampling:**

- Set `SAMPLING_ENABLED=false` in your environment or omit the `--sampling` flag.
- The bot will not listen to or respond to messages automatically.

**Message Filtering:**

Control which messages the bot responds to:

- **`RESPOND_TO_MENTIONS_ONLY`** (default: `true`): Only respond when the bot is mentioned.
- **`BLOCK_DMS`** (default: `true`): Ignore all direct messages.
- **`BLOCKED_GUILDS`**: Comma-separated guild IDs to ignore (e.g., `"123456789,987654321"`).
- **`BANNED_USERS`**: Comma-separated user IDs to ignore (e.g., `"111111111,222222222"`).

**Reaction Sampling:**

- **`REACTION_SAMPLING_ENABLED`** (default: `false`): Enable AI-generated contextual reactions when bot is mentioned. When disabled, no reaction is added.
- **`REACTION_TIMEOUT_MS`** (default: `3000`): Timeout (milliseconds) for AI-generated reaction requests.
- **`REACTION_FALLBACK_EMOJI`** (default: `"🤔"`): Emoji to use when reaction sampling times out or fails.

**Advanced options:**

- **`DEFAULT_RATE_LIMIT_SECONDS`**: Minimum seconds between sampling responses per user.
- **`DEFAULT_MESSAGE_CHUNK_SIZE`**: Maximum size of each message chunk sent in response.

---

## Tools Documentation

### Basic Functions

- `discord_send`: Send a message to a specified channel (supports both channel ID and channel name)
- `discord_get_server_info`: Get Discord server information

### Channel Management

- `discord_create_text_channel`: Create a text channel
- `discord_delete_channel`: Delete a channel

### Forum Functions

- `discord_get_forum_channels`: Get a list of forum channels
- `discord_create_forum_post`: Create a forum post
- `discord_get_forum_post`: Get a forum post
- `discord_reply_to_forum`: Reply to a forum post
- `discord_delete_forum_post`: Delete a forum post

### Messages and Reactions

- `discord_read_messages`: Read channel messages
- `discord_add_reaction`: Add a reaction to a message
- `discord_add_multiple_reactions`: Add multiple reactions to a message
- `discord_remove_reaction`: Remove a reaction from a message
- `discord_delete_message`: Delete a specific message from a channel

### Webhook Management

- `discord_create_webhook`: Creates a new webhook for a Discord channel
- `discord_send_webhook_message`: Sends a message to a Discord channel using a webhook
- `discord_edit_webhook`: Edits an existing webhook for a Discord channel
- `discord_delete_webhook`: Deletes an existing webhook for a Discord channel

## Development

```bash
# Development mode
pnpm run dev
```
