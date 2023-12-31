import fs from "fs";
import path from "path";

export const deleteAllFilesFrom = (dir: string) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        fs.unlinkSync(path.join(dir, file));
    }
};
