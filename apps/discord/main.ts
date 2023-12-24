import dotenv from "dotenv";
import { LeroLeroDiscordBot } from "./bot";
import { LeroLeroGeneratorFactory } from "../../packages/lerolero/utils/factory";
import { LeroLeroGenerator } from "../../packages/lerolero";

dotenv.config();

const main = () => {
  if (!process.env.DISCORD_TOKEN) {
    throw new Error("DISCORD_TOKEN not found");
  }

  if (!process.env.OPEN_AI_SECRET_KEY) {
    throw new Error("OPEN AI SECRET KEY not found");
  }

  let generator: LeroLeroGenerator;

  if (process.env.NODE_ENV === "PROD") {
    generator = LeroLeroGeneratorFactory.createGptLeroLero(
      process.env.OPEN_AI_SECRET_KEY
    );
  } else {
    generator = LeroLeroGeneratorFactory.createMockLeroLero();
  }

  const bot = new LeroLeroDiscordBot(
    { token: process.env.DISCORD_TOKEN },
    generator
  );
  bot.run();
};

main();
