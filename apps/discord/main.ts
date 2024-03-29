import dotenv from "dotenv";
import { LeroLeroDiscordBot } from "./bot";
import { LeroLeroFactory } from "../../packages/lerolero/utils/factory";
import { LeroLeroGenerator } from "../../packages/lerolero";
import { S3GenerationHistory } from "../../packages/history";
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();

const main = () => {
    if (!process.env.DISCORD_TOKEN) {
        throw new Error("DISCORD_TOKEN not found");
    }

    if (!process.env.OPEN_AI_SECRET_KEY) {
        throw new Error("OPEN AI SECRET KEY not found");
    }

    let generator: LeroLeroGenerator;

    if (process.env.NODE_ENV === "PROD_REMOTE") {
        if (
            !process.env.AWS_ACCESS_KEY ||
            !process.env.AWS_SECRET_KEY ||
            !process.env.AWS_S3_BUCKET_NAME
        ) {
            throw new Error("AWS_ACCESS_KEY_ID or AWS_SECRET_KEY not found");
        }

        const s3Client = new S3Client({
            region: process.env.AWS_S3_REGION || "sa-east-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
        const history = new S3GenerationHistory(s3Client, {
            bucket: process.env.AWS_S3_BUCKET_NAME,
        });

        generator = LeroLeroFactory.createWithGpt(
            process.env.OPEN_AI_SECRET_KEY,
            history
        );
    } else if (process.env.NODE_ENV === "PROD") {
        generator = LeroLeroFactory.createWithGpt(
            process.env.OPEN_AI_SECRET_KEY
        );
    } else {
        generator = LeroLeroFactory.createWithMock();
    }

    const bot = new LeroLeroDiscordBot(
        { token: process.env.DISCORD_TOKEN },
        generator
    );
    bot.run();
};

main();
