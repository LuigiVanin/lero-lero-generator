import { GenerationMessage } from "../generation";
import { GenerationHistory } from "./interfaces/GenerationHistory";

export class InMemoryGenerationHistory implements GenerationHistory {
  private history: Map<string, GenerationMessage[]> = new Map();

  async get(id: string): Promise<GenerationMessage[]> {
    return this.history.get(id) || [];
  }

  async set(id: string, messages: GenerationMessage[]): Promise<void> {
    this.history.set(id, messages);
  }

  async update(id: string, message: GenerationMessage): Promise<void> {
    const messages = this.history.get(id);
    if (!messages) {
      this.set(id, [message]);
      return;
    }
    this.history.set(id, [...messages, message]);
  }
}
