import { MockTextGenerationService } from "../packages/generation";
import { InMemoryGenerationHistory } from "../packages/history";
import { LeroLeroGenerator } from "../packages/lerolero";
import { generateRandomText } from "./utils/rng";

describe("Mock Generation Service Tests", () => {
    it("Expect generation not to throw", async () => {
        const history = new InMemoryGenerationHistory();
        const generator = new MockTextGenerationService();

        const lerolero = new LeroLeroGenerator(generator, history);

        expect(lerolero.generate("id", "message")).resolves.not.toThrow();
        expect(() => lerolero.generate("id", "message")).not.toThrow();
    });

    it("Generating simple text", async () => {
        const history = new InMemoryGenerationHistory();
        const generator = new MockTextGenerationService();

        const lerolero = new LeroLeroGenerator(generator, history);

        const id = generateRandomText(10);
        const message = generateRandomText(100);

        const response = await lerolero.generate(id, message);

        expect(response).not.toBeNull();
        expect(response).not.toBeUndefined();

        console.log(response);

        expect(response).toContain(message);
        expect(() => response && JSON.parse(response)).not.toThrow();

        const json = response && JSON.parse(response);

        expect(json).not.toBeNull();

        expect(json).toHaveLength(2);

        // NOTE: the first message is always the system message
        expect(json[0]).toHaveProperty("role", "system");

        expect(json[1]).toHaveProperty("role", "user");
        expect(json[1]).toHaveProperty("content", message);
    });

    it("Generating text and getting result on history", async () => {
        const history = new InMemoryGenerationHistory();
        const generator = new MockTextGenerationService();

        const lerolero = new LeroLeroGenerator(generator, history);

        const id = generateRandomText(10);
        const message = generateRandomText(100);

        await lerolero.generate(id, message);

        const historyMessages = await history.get(id);

        expect(historyMessages).not.toBeNull();
        expect(historyMessages).not.toBeUndefined();

        expect(historyMessages).toHaveLength(2);

        const wrongId1 = generateRandomText(10);

        const wrongHistoryMessages = await history.get(wrongId1);

        expect(wrongHistoryMessages).toHaveLength(0);

        const wrongId2 = generateRandomText(10);

        const wrongHistoryMessages2 = await history.get(wrongId2);

        expect(wrongHistoryMessages2).toHaveLength(0);
    });

    it("Generating text and getting text result on history", async () => {
        const history = new InMemoryGenerationHistory();
        const generator = new MockTextGenerationService();

        const lerolero = new LeroLeroGenerator(generator, history);

        const id = generateRandomText(10);
        const message = generateRandomText(100);

        const result = await lerolero.generate(id, message);

        const historyMessages = await history.get(id);

        expect(historyMessages).not.toBeNull();
        expect(historyMessages).not.toBeUndefined();

        expect(historyMessages).toHaveLength(2);

        expect(historyMessages[0]).toHaveProperty("role", "user");
        expect(historyMessages[0]).toHaveProperty("content", message);

        expect(historyMessages[1]).toHaveProperty("role", "assistant");
        expect(historyMessages[1]).toHaveProperty("content", result);

        const message2 = generateRandomText(100);

        await lerolero.generate(id, message2);

        const historyMessages2 = await history.get(id);

        expect(historyMessages2).not.toBeNull();
        expect(historyMessages2).not.toBeUndefined();

        expect(historyMessages2).toHaveLength(4);

        expect(historyMessages2[2]).toHaveProperty("role", "user");
        expect(historyMessages2[3]).toHaveProperty("role", "assistant");

        expect(historyMessages2[2]).toHaveProperty("content", message2);
    });

    it("Adding multiple messages to history and checking length and text on different Ids", async () => {
        const history = new InMemoryGenerationHistory();
        const generator = new MockTextGenerationService();

        const lerolero = new LeroLeroGenerator(generator, history);
        const message = generateRandomText(100);

        for (let i = 0; i < 50; i++) {
            const id = generateRandomText(10);

            const result = await lerolero.generate(id, message);

            const historyMessages = await history.get(id);

            expect(historyMessages).not.toBeNull();
            expect(historyMessages).not.toBeUndefined();

            expect(historyMessages).toHaveLength(2);

            expect(historyMessages[0]).toHaveProperty("role", "user");
            expect(historyMessages[0]).toHaveProperty("content", message);

            expect(historyMessages[1]).toHaveProperty("role", "assistant");
            expect(historyMessages[1]).toHaveProperty("content", result);
        }
    });

    it("Adding multiple messages to history and checking length and text on same Id", async () => {
        const history = new InMemoryGenerationHistory();
        const generator = new MockTextGenerationService();

        const lerolero = new LeroLeroGenerator(generator, history);

        const id = generateRandomText(10);
        const message = generateRandomText(50);

        for (let i = 0; i < 10; i++) {
            const result = await lerolero.generate(id, message);

            const historyMessages = await history.get(id);

            expect(historyMessages).not.toBeNull();
            expect(historyMessages).not.toBeUndefined();

            expect(historyMessages).toHaveLength(2 * (i + 1));

            expect(historyMessages[2 * i]).toHaveProperty("role", "user");
            expect(historyMessages[2 * i]).toHaveProperty("content", message);

            expect(historyMessages[2 * i + 1]).toHaveProperty(
                "role",
                "assistant"
            );
            expect(historyMessages[2 * i + 1]).toHaveProperty(
                "content",
                result
            );
        }
    });
});
