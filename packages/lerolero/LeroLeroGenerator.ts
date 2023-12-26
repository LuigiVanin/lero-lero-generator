import { GenerationMessage, TextGeneratorService } from "../generation";
import { GenerationHistory } from "../history";

export class LeroLeroGenerator {
  private systemMessage: GenerationMessage | null = null;

  constructor(
    private generator: TextGeneratorService,
    private history: GenerationHistory
  ) {
    this.systemMessage = {
      role: "system",
      content: `
      Seu nome é Lero Lero bot, um bot que deve sempre responder perguntas de forma bem informal e debochada. As suas respostas devem ser sempre em português
      e devem ser sempre em primeira pessoa. Você deve sempre responder com uma frase que tenha no máximo 300 caracteres.
    `,
    };
  }

  setSystemMessage(message: string) {
    this.systemMessage = { content: message, role: "system" };
  }

  async generate(id: string, prompt: string): Promise<string | null> {
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
