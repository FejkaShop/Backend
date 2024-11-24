import express, { Request, Response, Router } from 'express';
import { ImageService } from '../services/image.service';

const router: Router = express.Router();
const imageService: ImageService = new ImageService();

router.get('/:filename', async (req: Request, res: Response) => {
    const { filename } = req.params;

    try {
        const imageData = await imageService.getImage(filename);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(imageData);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: 'Image not found!' });
    }
});

export default router;
