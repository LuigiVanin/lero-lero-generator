import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";

export type OpenAiGptConfig = Omit<
  ChatCompletionCreateParamsNonStreaming,
  "messages"
>;
