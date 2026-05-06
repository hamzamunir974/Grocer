import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(search?: string, categoryId?: string): Promise<import("./product.entity").Product[]>;
    getTrending(): Promise<import("./product.entity").Product[]>;
    findAllAdmin(search?: string, categoryId?: string): Promise<import("./product.entity").Product[]>;
    findOne(id: string): Promise<import("./product.entity").Product>;
    create(dto: CreateProductDto, image?: Express.Multer.File): Promise<import("./product.entity").Product>;
    update(id: string, dto: UpdateProductDto, image?: Express.Multer.File): Promise<import("./product.entity").Product>;
    remove(id: string): Promise<void>;
}
