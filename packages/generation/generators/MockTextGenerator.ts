import { TextGeneratorService } from "../interfaces/TextGeneratorService";
import { GenerationMessage } from "../types/generation";

export class MockTextGenerationService implements TextGeneratorService {
    constructor() {}

    async generate(
        prompt: string,
        messages: GenerationMessage[]
    ): Promise<string> {
        return JSON.stringify([...messages, { content: prompt, role: "user" }]);
    }
}
