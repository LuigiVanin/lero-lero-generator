import { GenerationMessage } from "../generation";
import { GenerationHistory } from "./interfaces/GenerationHistory";
import fs from "fs";

export class InDiskGenerationHistory implements GenerationHistory {
  constructor(private path: string) {
    this.createFolder();
  }

  private createFolder(): void {
    try {
      fs.readdirSync(this.path);
    } catch (error) {
      fs.mkdirSync(this.path);
    }
  }

  private createFile(id: string) {
    fs.writeFileSync(`${this.path}/${id}.json`, JSON.stringify([]));
  }

  private fileExistsOnList(files: string[], id: string) {
    return files.find((file) => file === `${id}.json`);
  }

  async get(id: string): Promise<GenerationMessage[]> {
    const files = fs.readdirSync(this.path);

    if (!this.fileExistsOnList(files, id)) {
      this.createFile(id);
    }

    const file = fs.readFileSync(`${this.path}/${id}.json`, "utf-8");
    return JSON.parse(file);
  }

  async set(id: string, messages: GenerationMessage[]): Promise<void> {
    const files = fs.readdirSync(this.path);

    if (!this.fileExistsOnList(files, id)) {
      this.createFile(id);
    }

    fs.writeFileSync(`${this.path}/${id}.json`, JSON.stringify(messages));
  }

  async update(id: string, message: GenerationMessage): Promise<void> {
    const messages = await this.get(id);
    messages.push(message);
    this.set(id, messages);
  }
}
