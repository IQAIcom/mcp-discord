---
"@iqai/mcp-discord": patch
---

Fixed environment variable parsing for boolean values:

- Fixed `ZodError` when parsing boolean environment variables (SAMPLING_ENABLED, RESPOND_TO_MENTIONS_ONLY, BLOCK_DMS, REACTION_SAMPLING_ENABLED)
- Environment variables are now properly coerced from strings to their expected types
