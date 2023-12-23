import { GenerationMessage, TextGeneratorService } from "../generation";
import { GenerationHistory } from "../history";

export class LeroLeroGenerator {
  systemMessage: GenerationMessage | null = null;

  constructor(
    private generator: TextGeneratorService,
    private history: GenerationHistory
  ) {}

  setSystemMessage(message: string) {
    this.systemMessage = { content: message, role: "system" };
  }

  async generate(id: string, prompt: string): Promise<string | null> {
    console.log("LeroLeroGenerator.Id", id);
    const messages = this.history.get(id).slice(-5);
    if (this.systemMessage) {
      messages?.unshift(this.systemMessage);
    }

    const result = await this.generator.generate(prompt, messages || []);
    if (result) {
      this.history.update(id, { content: prompt, role: "user" });
      this.history.update(id, { content: result, role: "assistant" });
    }

    return result;
  }
}
