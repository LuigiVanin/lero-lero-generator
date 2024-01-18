import { ChatCompletionMessageParam } from "openai/resources";
import { MockTextGenerationService } from "../packages/generation";
import { generateRandomText } from "./utils/rng";

describe("Mock Generation Service Tests", () => {
    it("Generating simple text", async () => {
        const gen = new MockTextGenerationService();
        const textPrompt = generateRandomText();
        const result = await gen.generate(textPrompt, []);

        const expectedMessageOutput = [
            {
                content: textPrompt,
                role: "user",
            },
        ];

        expect(() => JSON.parse(result)).not.toThrow();
        expect(JSON.parse(result)).toStrictEqual(expectedMessageOutput);
        expect(JSON.parse(result)).length(1);
        expect(result).toBe(JSON.stringify(expectedMessageOutput));
    });

    it("Generating text with messages", async () => {
        const gen = new MockTextGenerationService();
        const textPrompt = generateRandomText();
        const messages: ChatCompletionMessageParam[] = [
            {
                content: textPrompt,
                role: "user",
            },
            {
                content: textPrompt,
                role: "assistant",
            },
        ];
        const result = await gen.generate(textPrompt, messages);

        const expectedMessageOutput = [
            ...messages,
            {
                content: textPrompt,
                role: "user",
            },
        ];

        expect(() => JSON.parse(result)).not.toThrow();
        expect(JSON.parse(result)).toStrictEqual(expectedMessageOutput);
        expect(JSON.parse(result)).length(3);
        expect(result).toBe(JSON.stringify(expectedMessageOutput));
    });

    it("Expect generation not to throw", async () => {
        const gen = new MockTextGenerationService();

        expect(gen.generate("id", [])).resolves.not.toThrow();
        expect(() => gen.generate("id", [])).not.toThrow();
    });
});
