import fs from 'fs';
import path from 'path';

export class ImageService {
    private readonly imageDirectory: string;

    constructor() {
        this.imageDirectory = path.resolve(__dirname, '../../images');
    }

    public async getImage(filename: string): Promise<Buffer> {
        const imagePath = path.join(this.imageDirectory, filename);

        return new Promise((resolve, reject) => {
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    reject(new Error('Image not found or cannot be loaded.'));
                } else {
                    resolve(data);
                }
            });
        });
    }
}
