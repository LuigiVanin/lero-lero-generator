import { GenerationMessage } from "../../generation";

export interface GenerationHistory {
  get(id: string): GenerationMessage[];
  set(id: string, messages: GenerationMessage[]): void;
  update(id: string, messages: GenerationMessage): void;
}
