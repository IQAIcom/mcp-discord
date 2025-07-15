export {
  createCategoryHandler,
  createTextChannelHandler,
  deleteCategoryHandler,
  deleteChannelHandler,
  editCategoryHandler,
  getServerInfoHandler,
  readMessagesHandler,
} from './channel.js';
export {
  createForumPostHandler,
  deleteForumPostHandler,
  getForumChannelsHandler,
  getForumPostHandler,
  replyToForumHandler,
} from './forum.js';
export { loginHandler } from './login.js';
export {
  addMultipleReactionsHandler,
  addReactionHandler,
  deleteMessageHandler,
  removeReactionHandler,
} from './reactions.js';
export { sendMessageHandler } from './send-message.js';
export { ToolContext, ToolHandler, ToolResponse } from './types.js';
export {
  createWebhookHandler,
  deleteWebhookHandler,
  editWebhookHandler,
  sendWebhookMessageHandler,
} from './webhooks.js';

import type { Client } from 'discord.js';
import type { ToolContext } from './types.js';

// Create tool context
export function createToolContext(client: Client): ToolContext {
  return { client };
}
