# @iqai/mcp-discord

## 0.0.3

### Patch Changes

- 88d3e12: Enhanced sampling with dynamic reactions, message filtering, and improved UX:

  - **Optional AI-Generated Reactions**: Bot can optionally request contextual emoji reactions from AI when mentioned (disabled by default, opt-in via `REACTION_SAMPLING_ENABLED`)
    - `REACTION_SAMPLING_ENABLED` (default: false) - Enable AI-generated contextual reactions (must be manually enabled). When disabled, no reaction is added.
    - `REACTION_TIMEOUT_MS` (default: 3000) - Configurable timeout for reaction sampling requests
    - `REACTION_FALLBACK_EMOJI` (default: "🤔") - Customizable fallback emoji when sampling times out or fails
  - **Message Replies**: All bot responses now use Discord's reply feature instead of direct channel sends for better context and conversation threading
  - **Advanced Message Filtering**: New configuration options to control bot behavior:
    - `RESPOND_TO_MENTIONS_ONLY` (default: true) - Only respond when bot is mentioned
    - `BLOCK_DMS` (default: true) - Block all direct messages
    - `BLOCKED_GUILDS` - Comma-separated list of guild IDs to ignore
    - `BANNED_USERS` - Comma-separated list of user IDs to ban
  - **Code Quality**: Refactored config parsing to reduce complexity and improve maintainability

## 0.0.2

### Patch Changes

- 73c1080: Added sampling
