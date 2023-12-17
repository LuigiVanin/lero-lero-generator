import { Client, ClientOptions, GatewayIntentBits } from "discord.js";

console.log("main.ts Starting discord app");

const clientConfig: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
};

const client = new Client(clientConfig);

client.on("messageCreate", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

client.login(process.env.DISCORD_TOKEN);
