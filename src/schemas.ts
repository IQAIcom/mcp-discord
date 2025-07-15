import { z } from 'zod';

export const DiscordLoginSchema = z.object({
  token: z.string().optional(),
});

export const SendMessageSchema = z.object({
  channelId: z.string(),
  message: z.string(),
});

export const GetForumChannelsSchema = z.object({
  guildId: z.string(),
});

export const CreateForumPostSchema = z.object({
  forumChannelId: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
});

export const GetForumPostSchema = z.object({
  threadId: z.string(),
});

export const ReplyToForumSchema = z.object({
  threadId: z.string(),
  message: z.string(),
});

export const CreateTextChannelSchema = z.object({
  guildId: z.string(),
  channelName: z.string(),
  topic: z.string().optional(),
  reason: z.string().optional(),
});

// Category schemas
export const CreateCategorySchema = z.object({
  guildId: z.string(),
  name: z.string(),
  position: z.number().optional(),
  reason: z.string().optional(),
});

export const EditCategorySchema = z.object({
  categoryId: z.string(),
  name: z.string().optional(),
  position: z.number().optional(),
  reason: z.string().optional(),
});

export const DeleteCategorySchema = z.object({
  categoryId: z.string(),
  reason: z.string().optional(),
});

export const DeleteChannelSchema = z.object({
  channelId: z.string(),
  reason: z.string().optional(),
});

export const ReadMessagesSchema = z.object({
  channelId: z.string(),
  limit: z.number().min(1).max(100).optional().default(50),
});

export const GetServerInfoSchema = z.object({
  guildId: z.string(),
});

export const AddReactionSchema = z.object({
  channelId: z.string(),
  messageId: z.string(),
  emoji: z.string(),
});

export const AddMultipleReactionsSchema = z.object({
  channelId: z.string(),
  messageId: z.string(),
  emojis: z.array(z.string()),
});

export const RemoveReactionSchema = z.object({
  channelId: z.string(),
  messageId: z.string(),
  emoji: z.string(),
  userId: z.string().optional(),
});

export const DeleteForumPostSchema = z.object({
  threadId: z.string(),
  reason: z.string().optional(),
});

export const DeleteMessageSchema = z.object({
  channelId: z.string(),
  messageId: z.string(),
  reason: z.string().optional(),
});

export const CreateWebhookSchema = z.object({
  channelId: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  reason: z.string().optional(),
});

export const SendWebhookMessageSchema = z.object({
  webhookId: z.string(),
  webhookToken: z.string(),
  content: z.string(),
  username: z.string().optional(),
  avatarURL: z.string().optional(),
  threadId: z.string().optional(),
});

export const EditWebhookSchema = z.object({
  webhookId: z.string(),
  webhookToken: z.string().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  channelId: z.string().optional(),
  reason: z.string().optional(),
});

export const DeleteWebhookSchema = z.object({
  webhookId: z.string(),
  webhookToken: z.string().optional(),
  reason: z.string().optional(),
});
