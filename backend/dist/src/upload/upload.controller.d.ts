import { ImageProcessingService } from './image-processing.service';
export declare class UploadController {
    private imageService;
    constructor(imageService: ImageProcessingService);
    uploadProductImage(file: Express.Multer.File): Promise<{
        message: string;
        url: string;
        filename: string;
    }>;
}
