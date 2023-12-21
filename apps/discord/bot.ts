import { Client, ClientOptions, GatewayIntentBits, Message } from "discord.js";
import { LeroLeroGenerator } from "../../packages/lerolero";

type ValidationResult = {
  valid: boolean;
  content?: string;
};

export class LeroLeroDiscordBot {
  client: Client;

  constructor(
    private clientOptions: Omit<ClientOptions, "intents"> & { token: string },
    private generator: LeroLeroGenerator
  ) {
    this.client = new Client({
      intents: LeroLeroDiscordBot.intents,
      ...this.clientOptions,
    });
  }

  static intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ];

  validateMessageToReply(msg: Message<boolean>): ValidationResult {
    const validationStart = `<@${this.client.user!.id}>`;
    if (msg.mentions.users.has(this.client.user!.id)) {
      const messageText = msg.content.replace(validationStart, "").trim();
      return { valid: !!messageText, content: messageText };
    }
    return { valid: false };
  }

  defineConversationId(msg: Message): string {
    return `${msg.guildId}${msg.author.id}`;
  }

  async reply(msg: Message, content: string) {
    const conversationId = this.defineConversationId(msg);
    const generatedText = await this.generator.generate(
      conversationId,
      content
    );
    msg.reply(generatedText || "");
  }

  run() {
    this.client
      .on("messageCreate", async (msg) => {
        if (!this.client.user?.id) return;
        const { valid, content } = this.validateMessageToReply(msg);

        if (valid && content) {
          await this.reply(msg, content);
        }
      })
      .login(this.clientOptions.token);
  }
}
