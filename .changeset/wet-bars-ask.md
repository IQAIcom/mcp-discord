---
"@iqai/mcp-discord": patch
---

Enhanced sampling with dynamic reactions, message filtering, and improved UX:

- **Dynamic AI-Generated Reactions**: Bot now requests contextual emoji reactions from AI when mentioned (1-second timeout, falls back to 🤔)
- **Message Replies**: All bot responses now use Discord's reply feature instead of direct channel sends for better context and conversation threading
- **Advanced Message Filtering**: New configuration options to control bot behavior:
  - `RESPOND_TO_MENTIONS_ONLY` (default: true) - Only respond when bot is mentioned
  - `BLOCK_DMS` (default: true) - Block all direct messages
  - `BLOCKED_GUILDS` - Comma-separated list of guild IDs to ignore
  - `BANNED_USERS` - Comma-separated list of user IDs to ban
  - `REACTION_TIMEOUT_MS` (default: 1000) - Configurable timeout for reaction sampling
- **Code Quality**: Refactored config parsing to reduce complexity and improve maintainability
