export declare class ImageProcessingService {
    private readonly uploadDir;
    constructor();
    private ensureUploadDir;
    processProductImage(buffer: Buffer, filename: string): Promise<{
        url: string;
        filename: string;
    }>;
    deleteImage(imageUrl: string): Promise<void>;
}
