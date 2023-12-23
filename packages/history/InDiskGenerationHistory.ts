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

  private fileExistsOnList(files: string[], id: string) {
    return files.find((file) => file === `${id}.json`);
  }

  private createFile(id: string) {
    fs.writeFileSync(`${this.path}/${id}.json`, JSON.stringify([]));
  }

  get(id: string): GenerationMessage[] {
    throw new Error("Method not implemented.");
  }
  async set(id: string, messages: GenerationMessage[]): Promise<void> {
    const files = fs.readdirSync(this.path);

    if (!this.fileExistsOnList(files, id)) {
      this.createFile(id);
    }

    fs.writeFileSync(`${this.path}/${id}.json`, JSON.stringify(messages));
    console.log(files);
  }

  update(id: string, message: GenerationMessage): void {
    throw new Error("Method not implemented.");
  }
}
