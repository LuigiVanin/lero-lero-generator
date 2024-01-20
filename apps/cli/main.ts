import dotenv from "dotenv";
import * as prompts from "@clack/prompts";
import colors from "picocolors";
import { LeroLeroGenerator } from "../../packages/lerolero";
import { S3Client } from "@aws-sdk/client-s3";
import { S3GenerationHistory } from "../../packages/history";
import { LeroLeroFactory } from "../../packages/lerolero/utils/factory";

dotenv.config();

const typeChatName = async () => {
    const chatName = await prompts.text({
        message: "Insert the name of the chat that you want to interact with:",
        validate: (input) => {
            if (input.length < 3) {
                return "The chat name must have at least 3 characters";
            }

            return;
        },
    });

    return chatName as string;
};

const selectChatNameLoop = async () => {
    let chatName = await typeChatName();

    if (prompts.isCancel(chatName)) return chatName;

    const shouldContinue = await prompts.confirm({
        message: `Do you want to start a conversation with Lero Lero CLI? [${chatName}]`,
    });

    if (!shouldContinue) {
        chatName = await selectChatNameLoop();
    }

    return chatName;
};

const main = async () => {
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

    prompts.intro(
        colors.bgCyan(` ${colors.bold("Starting Lero Lero CLI 🤖💬")} `)
    );

    const chatName = await selectChatNameLoop();

    if (prompts.isCancel(chatName)) {
        prompts.outro(colors.bgRed(` ${colors.bold("Bye bye! 👋👋")} `));
        return;
    }

    while (true) {
        const message = await prompts.text({
            message: colors.bold("You: "),
        });

        if (prompts.isCancel(message)) {
            break;
        }

        const loading = prompts.spinner();

        loading.start("Lero Lero Generator is thinking...");
        const result = await generator.generate(chatName, message);
        loading.stop(
            `${colors.bold("Lero Lero Generator:")} \n${colors.gray(
                `│ ${result}`
            )}`
        );
    }
};

main();
