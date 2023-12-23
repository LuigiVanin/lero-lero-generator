import { GenerationMessage } from "../generation";
import { GenerationHistory } from "./interfaces/GenerationHistory";

export class InMemoryGenerationHistory implements GenerationHistory {
  private history: Map<string, GenerationMessage[]> = new Map();

  get(id: string): GenerationMessage[] {
    console.log("InMemoryGenerationHistory.Id", this.history);
    return this.history.get(id) || [];
  }

  set(id: string, messages: GenerationMessage[]): void {
    this.history.set(id, messages);
  }

  update(id: string, message: GenerationMessage): void {
    const messages = this.history.get(id);
    if (!messages) {
      this.set(id, [message]);
      return;
    }
    this.history.set(id, [...messages, message]);
  }
}
