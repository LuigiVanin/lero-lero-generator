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
  constructor(private openAi: OpenAI, private systemMessage?: string) {
    console.log("GptTextGenerationService Maisty");
  }

  setSystemMessage(message: string) {
    this.systemMessage = message;
  }

  createMessages(
    text: string,
    messages: GenerationMessage[],
    systemMessage?: string
  ): GenerationMessage[] {
    const result: GenerationMessage[] = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];
    if (systemMessage) {
      result.unshift({
        role: "system",
        content: systemMessage,
      });
    }

    return result;
  }

  async generate(
    prompt: string,
    messages: GenerationMessage[],
    config?: OpenAiGptConfig
  ) {
    messages = this.createMessages(prompt, messages, this.systemMessage);
    const params: ChatCompletionCreateParamsNonStreaming = {
      ...openAiConfig,
      ...config,
      messages,
    };

    const response = await this.openAi.chat.completions.create(params);
    const generatedText = response.choices[0]?.message.content || null;

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
