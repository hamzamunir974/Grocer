import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ImageProcessingService } from '../upload/image-processing.service';
export declare class ProductsService {
    private productRepo;
    private imageService;
    constructor(productRepo: Repository<Product>, imageService: ImageProcessingService);
    create(dto: CreateProductDto, imageFile?: Express.Multer.File): Promise<Product>;
    findAll(search?: string, categoryId?: string): Promise<Product[]>;
    findAllAdmin(search?: string, categoryId?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, dto: UpdateProductDto, imageFile?: Express.Multer.File): Promise<Product>;
    remove(id: string): Promise<void>;
    getTrending(): Promise<Product[]>;
}
