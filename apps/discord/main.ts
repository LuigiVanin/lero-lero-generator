import { Client, ClientOptions, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

console.log("main.ts Starting discord app", process.env.DISCORD_TOKEN);

const clientConfig: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
};

const client = new Client(clientConfig);

client
  .on("messageCreate", (msg) => {
    if (!client.user?.id) return;

    if (msg.mentions.users.has(client.user!.id)) {
      const messageText = msg.content
        .replace(`<@${client.user!.id}>`, "")
        .trim();
      if (messageText.startsWith("ping")) {
        msg.reply("pong");
      }
    }
  })
  .login(process.env.DISCORD_TOKEN);

