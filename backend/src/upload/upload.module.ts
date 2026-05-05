import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { ImageProcessingService } from './image-processing.service';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  controllers: [UploadController],
  providers: [ImageProcessingService],
  exports: [ImageProcessingService],
})
export class UploadModule {}
