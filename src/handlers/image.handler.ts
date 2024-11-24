import * as fs from 'fs/promises';
import * as path from 'path';

export async function loadImage(filePath: string): Promise<Buffer> {
    try {
        const fullPath = path.resolve(filePath);

        return await fs.readFile(fullPath);
    } catch (error) {
        console.error(`Error loading image from file: ${filePath}`, error);
        throw new Error('Unable to load image');
    }
}