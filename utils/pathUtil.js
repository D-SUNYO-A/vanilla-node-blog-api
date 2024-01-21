import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

export const getFilePath = (url, importMetaUrl) => {
    const currentFileURL = importMetaUrl || import.meta.url;
    const currentDir = dirname(fileURLToPath(currentFileURL));
    const filePath = path.join(currentDir, url);
    return filePath;
}
