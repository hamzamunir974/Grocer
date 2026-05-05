import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ImageProcessingService } from '../upload/image-processing.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private imageService: ImageProcessingService,
  ) {}

  async create(dto: CreateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
    let imageUrl: string | undefined;

    if (imageFile) {
      const result = await this.imageService.processProductImage(
        imageFile.buffer,
        imageFile.originalname,
      );
      imageUrl = result.url;
    }

    const product = this.productRepo.create({ ...dto, imageUrl });
    return this.productRepo.save(product);
  }

  async findAll(search?: string, categoryId?: string): Promise<Product[]> {
    const where: any = {};
    if (search) where.name = Like(`%${search}%`);
    if (categoryId) where.categoryId = categoryId;
    where.isAvailable = true;

    return this.productRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findAllAdmin(search?: string, categoryId?: string): Promise<Product[]> {
    const where: any = {};
    if (search) where.name = Like(`%${search}%`);
    if (categoryId) where.categoryId = categoryId;

    return this.productRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
    const product = await this.findOne(id);

    if (imageFile) {
      if (product.imageUrl) {
        await this.imageService.deleteImage(product.imageUrl);
      }
      const result = await this.imageService.processProductImage(
        imageFile.buffer,
        imageFile.originalname,
      );
      (dto as any).imageUrl = result.url;
    }

    await this.productRepo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    if (product.imageUrl) {
      await this.imageService.deleteImage(product.imageUrl);
    }
    await this.productRepo.delete(id);
  }

  async getTrending(): Promise<Product[]> {
    return this.productRepo.find({
      where: { isAvailable: true },
      order: { createdAt: 'DESC' },
      take: 8,
    });
  }
}
