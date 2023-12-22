import dotenv from "dotenv";
import { LeroLeroDiscordBot } from "./bot";
import { LeroLeroGeneratorFactory } from "../../packages/lerolero/utils/factory";

dotenv.config();

console.log("main.ts Starting discord app", process.env.DISCORD_TOKEN);

if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN not found");
}

if (!process.env.OPEN_AI_SECRET_KEY) {
  throw new Error("OPEN AI SECRET KEY not found");
}

const generator = LeroLeroGeneratorFactory.createGptLeroLero(
  process.env.OPEN_AI_SECRET_KEY
);

const bot = new LeroLeroDiscordBot(
  { token: process.env.DISCORD_TOKEN },
  generator
);
bot.run();
