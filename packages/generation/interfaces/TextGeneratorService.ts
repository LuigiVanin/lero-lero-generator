import { GenerationMessage } from "../types/generation";

export interface TextGeneratorService {
  generate(
    prompt: string,
    messages: GenerationMessage[]
  ): Promise<string | null>;
}
