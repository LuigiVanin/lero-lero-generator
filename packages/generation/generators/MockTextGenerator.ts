import { TextGeneratorService } from "../interfaces/TextGeneratorService";
import { GenerationMessage } from "../types/generation";

export class MockTextGenerationService implements TextGeneratorService {
  constructor() {}

  async generate(
    prompt: string,
    messages: GenerationMessage[]
  ): Promise<string> {
    return (
      "prompt: " +
      prompt +
      "\nOlá! Em que posso ajudar?" +
      "\n" +
      (messages
        ?.splice(0, 6)
        .map((m) => m.content)
        .join("\n") || "Sem histórico")
    );
  }
}
