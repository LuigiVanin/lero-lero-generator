import fs from "fs";
import { ChatCompletionMessageParam } from "openai/resources";
import {
    InDiskGenerationHistory,
    InMemoryGenerationHistory,
} from "../packages/history";
import { generateRandomText } from "./utils/rng";
import { deleteAllFilesFrom } from "./utils/fs";

describe("In Memory History Tests", () => {
    it("Testing message insertion", () => {
        const history = new InMemoryGenerationHistory();
        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: "Hello, I am an assistant",
        };
        history.set("test", [{ ...message }]);

        history.get("test").then((res) => {
            expect(res).length(1);

            expect(res).toStrictEqual([
                {
                    role: "assistant",
                    content: "Hello, I am an assistant",
                },
            ]);

            expect(!!res.find(() => true)).toBe(true);
        });
    });

    it("Testing message insertion with multiple messages", () => {
        const history = new InMemoryGenerationHistory();
        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: generateRandomText(),
        };
        history.set("test", [{ ...message }, { ...message }, { ...message }]);

        history.get("test").then((res) => {
            expect(res).length(3);

            expect(res).toStrictEqual([
                {
                    role: "assistant",
                    content: message.content,
                },
                {
                    role: "assistant",
                    content: message.content,
                },
                {
                    role: "assistant",
                    content: message.content,
                },
            ]);

            res.forEach((message) => {
                expect(!!message).toBe(true);
            });
        });
    });

    it("Testing message insertion with multiple messages and multiple keys", () => {
        const history = new InMemoryGenerationHistory();
        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: generateRandomText(),
        };
        history.set("test", [{ ...message }, { ...message }, { ...message }]);
        history.set("test2", [{ ...message }, { ...message }, { ...message }]);

        history.get("test").then((res) => {
            expect(res).length(3);

            expect(res).toStrictEqual([
                {
                    role: "assistant",
                    content: message.content,
                },
                {
                    role: "assistant",
                    content: message.content,
                },
                {
                    role: "assistant",
                    content: message.content,
                },
            ]);

            res.forEach((msg) => {
                expect(!!msg).toBe(true);
            });
        });

        history.get("test2").then((res) => {
            expect(res).length(3);

            expect(res).toStrictEqual([
                {
                    role: "assistant",
                    content: message.content,
                },
                {
                    role: "assistant",
                    content: message.content,
                },
                {
                    role: "assistant",
                    content: message.content,
                },
            ]);

            res.forEach((msg) => {
                expect(!!msg).toBe(true);
            });
        });
    });

    it("Testing message update", () => {
        const history = new InMemoryGenerationHistory();
        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: generateRandomText(),
        };
        history.set("test", [{ ...message }]);
        history.set("test", [{ ...message }, { ...message }]);

        history.get("test").then((res) => {
            expect(res).length(2);

            expect(res).toStrictEqual([
                {
                    role: "assistant",
                    content: message.content,
                },
                {
                    role: "assistant",
                    content: message.content,
                },
            ]);

            res.forEach((msg) => {
                expect(!!msg).toBe(true);
            });
        });
    });

    it("Getting empty history keys", () => {
        const history = new InMemoryGenerationHistory();

        history.get("test").then((res) => {
            expect(res).length(0);
        });

        history.get("test2").then((res) => {
            expect(res).length(0);
        });
    });
});

describe("In Disk History Tests", () => {
    beforeAll(() => {
        try {
            fs.mkdirSync("../data/");
        } catch (error) {}
    });

    afterAll(() => {
        deleteAllFilesFrom("../data/");
    });

    it("Testing message insertion", async () => {
        const history = new InDiskGenerationHistory("../data/");
        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: generateRandomText(),
        };

        history.set("test", [
            {
                ...message,
            },
        ]);

        const res = await history.get("test");

        expect(res).length(1);

        expect(res).toStrictEqual([
            {
                role: "assistant",
                content: message.content,
            },
        ]);
    });

    it("Testing message insertion with multiple messages", async () => {
        const history = new InDiskGenerationHistory("../data/");
        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: generateRandomText(),
        };

        history.set("test", [
            {
                ...message,
            },
            {
                ...message,
            },
            {
                ...message,
            },
        ]);

        const res = await history.get("test");

        expect(res).length(3);

        expect(res).toStrictEqual([
            {
                role: "assistant",
                content: message.content,
            },
            {
                role: "assistant",
                content: message.content,
            },
            {
                role: "assistant",
                content: message.content,
            },
        ]);

        res.forEach((msg) => {
            expect(!!msg).toBe(true);
        });
    });

    it("Testing message insertion with multiple messages and multiple keys", async () => {
        const history = new InDiskGenerationHistory("../data/");
        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: generateRandomText(),
        };

        history.set("test", [
            {
                ...message,
            },
            {
                ...message,
            },
            {
                ...message,
            },
        ]);

        history.set("test2", [
            {
                ...message,
            },
            {
                ...message,
            },
            {
                ...message,
            },
        ]);

        const res = await history.get("test");

        expect(res).length(3);

        expect(res).toStrictEqual([
            {
                role: "assistant",
                content: message.content,
            },
            {
                role: "assistant",
                content: message.content,
            },
            {
                role: "assistant",
                content: message.content,
            },
        ]);

        res.forEach((msg) => {
            expect(!!msg).toBe(true);
        });

        const res2 = await history.get("test2");

        expect(res2).length(3);

        expect(res2).toStrictEqual([
            {
                role: "assistant",
                content: message.content,
            },
            {
                role: "assistant",
                content: message.content,
            },
            {
                role: "assistant",
                content: message.content,
            },
        ]);

        res2.forEach((msg) => {
            expect(!!msg).toBe(true);
        });
    });

    it("Testing message update", async () => {
        const history = new InDiskGenerationHistory("../data/");
        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: generateRandomText(),
        };

        history.set("test", [
            {
                ...message,
            },
        ]);

        history.set("test", [
            {
                ...message,
            },
            {
                ...message,
            },
        ]);

        const res = await history.get("test");

        expect(res).length(2);

        expect(res).toStrictEqual([
            {
                role: "assistant",
                content: message.content,
            },
            {
                role: "assistant",
                content: message.content,
            },
        ]);

        res.forEach((msg) => {
            expect(!!msg).toBe(true);
        });
    });

    it("Getting empty history keys", async () => {
        const history = new InDiskGenerationHistory("../data/");

        const res = await history.get("new key name");

        expect(res).length(0);

        const res2 = await history.get("new key name 2");

        expect(res2).length(0);
    });

    it("Getting value of same key from another instance of history", async () => {
        const history = new InDiskGenerationHistory("../data/");

        const message: ChatCompletionMessageParam = {
            role: "assistant",
            content: generateRandomText(),
        };

        history.set("test", [
            {
                ...message,
            },
        ]);

        const history2 = new InDiskGenerationHistory("../data/");

        const res = await history2.get("test");

        expect(res).length(1);

        expect(res).toStrictEqual([
            {
                role: "assistant",
                content: message.content,
            },
        ]);

        res.forEach((msg) => {
            expect(!!msg).toBe(true);
        });
    });
});
