import OpenAI from "openai";
import { LeroLeroGenerator } from "..";
import {
  GptTextGenerationService,
  MockTextGenerationService,
} from "../../generation";
import { GenerationHistory, InMemoryGenerationHistory } from "../../history";

export class LeroLeroGeneratorFactory {
  static createGptLeroLero(
    apiKey: string,
    history: GenerationHistory = new InMemoryGenerationHistory()
  ): LeroLeroGenerator {
    const openAi = new OpenAI({
      apiKey,
    });

    const generatorService = new GptTextGenerationService(openAi);

    return new LeroLeroGenerator(generatorService, history);
  }

  static createMockLeroLero(
    history: GenerationHistory = new InMemoryGenerationHistory()
  ): LeroLeroGenerator {
    const generatorService = new MockTextGenerationService();
    return new LeroLeroGenerator(generatorService, history);
  }
}
