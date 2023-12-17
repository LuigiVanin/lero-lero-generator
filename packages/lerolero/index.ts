import { TextGeneratorService } from "../generation";
import { GenerationHistory } from "../history";

export class LeroLeroGenerator {
  constructor(
    private generator: TextGeneratorService,
    private history: GenerationHistory
  ) {}

  async generate(id: string, prompt: string): Promise<string | null> {
    const messages = this.history.get(id);
    const result = await this.generator.generate(prompt, messages);

    return result;
  }
}
