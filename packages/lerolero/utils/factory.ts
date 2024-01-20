import OpenAI from "openai";
import { LeroLeroGenerator } from "..";
import {
    GptTextGenerationService,
    MockTextGenerationService,
} from "../../generation";
import { GenerationHistory, InMemoryGenerationHistory } from "../../history";
import { InDiskGenerationHistory } from "../../history/InDiskGenerationHistory";

export class LeroLeroFactory {
    static createWithGpt(
        apiKey: string,
        history: GenerationHistory = new InDiskGenerationHistory("./data")
    ): LeroLeroGenerator {
        const openAi = new OpenAI({
            apiKey,
        });

        const generatorService = new GptTextGenerationService(openAi);

        return new LeroLeroGenerator(generatorService, history);
    }

    static createWithMock(
        history: GenerationHistory = new InDiskGenerationHistory("./data")
        // history: GenerationHistory = new InMemoryGenerationHistory()
    ): LeroLeroGenerator {
        const generatorService = new MockTextGenerationService();
        history.set("openai", []);
        return new LeroLeroGenerator(generatorService, history);
    }
}
