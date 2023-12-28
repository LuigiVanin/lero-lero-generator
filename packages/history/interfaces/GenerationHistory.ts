import { GenerationMessage } from "../../generation";

export interface GenerationHistory {
  get(id: string): Promise<GenerationMessage[]>;
  set(id: string, messages: GenerationMessage[]): Promise<void>;
  update(id: string, messages: GenerationMessage): Promise<void>;
}
