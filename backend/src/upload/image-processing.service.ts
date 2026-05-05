import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ImageProcessingService {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    const productsDir = path.join(this.uploadDir, 'products');
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }
  }

  /**
   * Constraint 1: Center-crop to 1:1 aspect ratio
   * Constraint 2: Convert to WebP, compress < 1MB
   */
  async processProductImage(
    buffer: Buffer,
    filename: string,
  ): Promise<{ url: string; filename: string }> {
    const outputFilename = `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}.webp`;
    const outputPath = path.join(this.uploadDir, 'products', outputFilename);

    // Get metadata to determine crop dimensions
    const metadata = await sharp(buffer).metadata();
    const { width = 800, height = 800 } = metadata;
    const size = Math.min(width, height);

    // Center crop to 1:1 then resize to 800x800, convert to WebP
    let processedBuffer = await sharp(buffer)
      .extract({
        left: Math.floor((width - size) / 2),
        top: Math.floor((height - size) / 2),
        width: size,
        height: size,
      })
      .resize(800, 800)
      .webp({ quality: 80 })
      .toBuffer();

    // If still > 1MB, reduce quality progressively
    let quality = 70;
    while (processedBuffer.length > 1 * 1024 * 1024 && quality > 20) {
      processedBuffer = await sharp(buffer)
        .extract({
          left: Math.floor((width - size) / 2),
          top: Math.floor((height - size) / 2),
          width: size,
          height: size,
        })
        .resize(800, 800)
        .webp({ quality })
        .toBuffer();
      quality -= 10;
    }

    fs.writeFileSync(outputPath, processedBuffer);

    return {
      url: `/uploads/products/${outputFilename}`,
      filename: outputFilename,
    };
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;
    const filepath = path.join(process.cwd(), imageUrl);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}
