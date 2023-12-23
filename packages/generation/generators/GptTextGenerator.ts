import OpenAI from "openai";
import { TextGeneratorService } from "../interfaces/TextGeneratorService";
import { OpenAiGptConfig } from "../types/openai";
import { GenerationMessage } from "../types/generation";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";

const openAiConfig: OpenAiGptConfig = {
  model: "gpt-3.5-turbo",
  temperature: 1,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export class GptTextGenerationService implements TextGeneratorService {
  constructor(private openAi: OpenAI) {
    console.log("GptTextGenerationService Maisty");
  }

  createMessages(
    text: string,
    messages: GenerationMessage[]
  ): GenerationMessage[] {
    const result: GenerationMessage[] = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];

    return result;
  }

  async generate(
    prompt: string,
    messages: GenerationMessage[],
    config?: OpenAiGptConfig
  ) {
    messages = this.createMessages(prompt, messages);
    const params: ChatCompletionCreateParamsNonStreaming = {
      ...openAiConfig,
      ...config,
      messages,
    };

    console.log("GptTextGenerationService.generate", params);

    const response = await this.openAi.chat.completions.create(params);
    const generatedText = response.choices[0]?.message.content || null;

    console.log("GptTextGenerationService.generate", generatedText);

    return generatedText;
  }
}

// import OpenAI from "openai";
// import { GptTextGenerationService } from "../../packages/generation";
// import dotenv from "dotenv";

// console.log("main.ts");
// dotenv.config();

// console.log("DOTENV: ", process.env.OPEN_AI_SECRET_KEY);

// const openAi = new OpenAI({
//   apiKey: "",
// });

// const service = new GptTextGenerationService(openAi);

// const result = service
//   .generate("Olá", [])
//   .then((result) => {
//     console.log("RESULT: ", result);
//   })
//   .catch((err) => {
//     console.log("ERROR: ", err);
//   });
// console.log(result);
