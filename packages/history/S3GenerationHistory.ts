import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { GenerationMessage } from "../generation";
import { GenerationHistory } from "./interfaces/GenerationHistory";

export class S3GenerationHistory implements GenerationHistory {
  constructor(
    private client: S3Client,
    private options: {
      bucket: string;
    }
  ) {}

  async get(id: string): Promise<GenerationMessage[]> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.options.bucket,
          Key: `${id}.json`,
        })
      );

      return JSON.parse((await response.Body?.transformToString()) || "[]");
    } catch (error) {
      return [];
    }
  }

  async set(id: string, messages: GenerationMessage[]): Promise<void> {
    const response = await this.client.send(
      new PutObjectCommand({
        Bucket: this.options.bucket,
        Key: `${id}.json`,
        Body: JSON.stringify(messages),
      })
    );
  }
  async update(id: string, message: GenerationMessage): Promise<void> {
    const messages = await this.get(id);
    messages.push(message);
    this.set(id, messages);
  }
}
