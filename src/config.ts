import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  SAMPLING_ENABLED: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      'Enables bi directional communication between the client and server, in this case for listening to messages'
    ),
  TRANSPORT: z.string().optional().default('stdio'),
  HTTP_PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 8080)),
  DEFAULT_RATE_LIMIT_SECONDS: z
    .number()
    .optional()
    .default(2)
    .describe('used in sampling, when sampling is enabled'),
  DEFAULT_MESSAGE_CHUNK_SIZE: z
    .number()
    .optional()
    .default(2000)
    .describe('chunk size for sampling'),
  RESPOND_TO_MENTIONS_ONLY: z
    .boolean()
    .optional()
    .default(true)
    .describe('Only respond to messages that mention the bot'),
  BLOCK_DMS: z
    .boolean()
    .optional()
    .default(true)
    .describe('Block direct messages to the bot'),
  BLOCKED_GUILDS: z
    .string()
    .optional()
    .default('')
    .describe('Comma-separated list of guild IDs to block'),
  BANNED_USERS: z
    .string()
    .optional()
    .default('')
    .describe('Comma-separated list of user IDs to ban'),
  REACTION_TIMEOUT_MS: z
    .number()
    .optional()
    .default(10_000)
    .describe('Timeout for reaction sampling requests in milliseconds'),
});

// Parse environment variables first
const envVars = envSchema.parse(process.env);

const getArgValue = (
  args: string[],
  argName: string,
  defaultValue: string
): string => {
  const argIndex = args.indexOf(argName);
  return argIndex !== -1 && argIndex + 1 < args.length
    ? args[argIndex + 1]
    : defaultValue;
};

const getNumberArgValue = (
  args: string[],
  argName: string,
  defaultValue: number
): number => {
  const argIndex = args.indexOf(argName);
  return argIndex !== -1 && argIndex + 1 < args.length
    ? Number.parseInt(args[argIndex + 1], 10)
    : defaultValue;
};

const getBooleanArgValue = (
  args: string[],
  argName: string,
  defaultValue: boolean
): boolean => {
  return args.indexOf(argName) !== -1 || defaultValue;
};

const parseDiscordToken = (args: string[], defaultToken: string): string => {
  const configIndex = args.indexOf('--config');
  if (configIndex === -1 || configIndex + 1 >= args.length) {
    return defaultToken;
  }

  const configArg = args[configIndex + 1];
  try {
    const parsedConfig = JSON.parse(configArg);
    return parsedConfig.DISCORD_TOKEN || defaultToken;
  } catch {
    return configArg;
  }
};

const getConfigFromArgs = (): z.infer<typeof envSchema> => {
  const args = process.argv;

  return {
    DISCORD_TOKEN: parseDiscordToken(args, envVars.DISCORD_TOKEN),
    SAMPLING_ENABLED: getBooleanArgValue(
      args,
      '--sampling',
      envVars.SAMPLING_ENABLED
    ),
    TRANSPORT: getArgValue(args, '--transport', envVars.TRANSPORT),
    HTTP_PORT: getNumberArgValue(args, '--port', envVars.HTTP_PORT),
    DEFAULT_RATE_LIMIT_SECONDS: getNumberArgValue(
      args,
      '--rate-limit',
      envVars.DEFAULT_RATE_LIMIT_SECONDS
    ),
    DEFAULT_MESSAGE_CHUNK_SIZE: getNumberArgValue(
      args,
      '--message-chunk-size',
      envVars.DEFAULT_MESSAGE_CHUNK_SIZE
    ),
    RESPOND_TO_MENTIONS_ONLY: getBooleanArgValue(
      args,
      '--mentions-only',
      envVars.RESPOND_TO_MENTIONS_ONLY
    ),
    BLOCK_DMS: getBooleanArgValue(args, '--block-dms', envVars.BLOCK_DMS),
    BLOCKED_GUILDS: getArgValue(
      args,
      '--blocked-guilds',
      envVars.BLOCKED_GUILDS
    ),
    BANNED_USERS: getArgValue(args, '--banned-users', envVars.BANNED_USERS),
    REACTION_TIMEOUT_MS: getNumberArgValue(
      args,
      '--reaction-timeout',
      envVars.REACTION_TIMEOUT_MS
    ),
  };
};

export const env = getConfigFromArgs();
