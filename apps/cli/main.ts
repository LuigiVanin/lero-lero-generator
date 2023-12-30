import * as prompts from "@clack/prompts";
import colors from "picocolors";

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
    console.log("main");

    prompts.intro(
        colors.bgCyan(` ${colors.bold("Starting Lero Lero CLI 🤖💬")} `)
    );

    const chatName = await selectChatNameLoop();

    if (prompts.isCancel(chatName)) {
        prompts.outro(colors.bgRed(` ${colors.bold("Bye bye! 👋👋")} `));
        return;
    }
};

main();
