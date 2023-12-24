import { GenerationMessage } from "../generation";
import { GenerationHistory } from "./interfaces/GenerationHistory";

export class S3GenerationHistory implements GenerationHistory {
  get(id: string): GenerationMessage[] {
    throw new Error("Method not implemented.");
  }
  set(id: string, messages: GenerationMessage[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(id: string, message: GenerationMessage): void {
    throw new Error("Method not implemented.");
  }
}
