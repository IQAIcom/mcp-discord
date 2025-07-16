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
});

// Parse environment variables first
const envVars = envSchema.parse(process.env);

// Handle command line arguments with fallback to environment variables
const getConfigFromArgs = (): z.infer<typeof envSchema> => {
  const args = process.argv;

  // Check for --config argument (JSON string)
  const configIndex = args.indexOf('--config');
  let discordToken = envVars.DISCORD_TOKEN;
  if (configIndex !== -1 && configIndex + 1 < args.length) {
    const configArg = args[configIndex + 1];
    try {
      const parsedConfig = JSON.parse(configArg);
      if (parsedConfig.DISCORD_TOKEN) {
        discordToken = parsedConfig.DISCORD_TOKEN;
      }
    } catch {
      // If not valid JSON, try using the string directly
      discordToken = configArg;
    }
  }

  // Check for --transport argument
  const transportIndex = args.indexOf('--transport');
  const transport =
    transportIndex !== -1 && transportIndex + 1 < args.length
      ? args[transportIndex + 1]
      : envVars.TRANSPORT;

  // Check for --port argument
  const portIndex = args.indexOf('--port');
  const httpPort =
    portIndex !== -1 && portIndex + 1 < args.length
      ? Number.parseInt(args[portIndex + 1], 10)
      : envVars.HTTP_PORT;

  // Check for --sampling flag
  const samplingEnabled =
    args.indexOf('--sampling') !== -1 || envVars.SAMPLING_ENABLED;

  // Check for --rate-limit argument
  const rateLimitIndex = args.indexOf('--rate-limit');
  const rateLimit =
    rateLimitIndex !== -1 && rateLimitIndex + 1 < args.length
      ? Number.parseInt(args[rateLimitIndex + 1], 10)
      : envVars.DEFAULT_RATE_LIMIT_SECONDS;

  // Check for --message-chunk-size argument
  const messageChunkSizeIndex = args.indexOf('--message-chunk-size');
  const messageChunkSize =
    messageChunkSizeIndex !== -1 && messageChunkSizeIndex + 1 < args.length
      ? Number.parseInt(args[messageChunkSizeIndex + 1], 10)
      : envVars.DEFAULT_MESSAGE_CHUNK_SIZE;

  return {
    DISCORD_TOKEN: discordToken,
    SAMPLING_ENABLED: samplingEnabled,
    TRANSPORT: transport,
    HTTP_PORT: httpPort,
    DEFAULT_RATE_LIMIT_SECONDS: rateLimit,
    DEFAULT_MESSAGE_CHUNK_SIZE: messageChunkSize,
  };
};

export const env = getConfigFromArgs();
