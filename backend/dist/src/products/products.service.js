"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const image_processing_service_1 = require("../upload/image-processing.service");
let ProductsService = class ProductsService {
    productRepo;
    imageService;
    constructor(productRepo, imageService) {
        this.productRepo = productRepo;
        this.imageService = imageService;
    }
    async create(dto, imageFile) {
        let imageUrl = dto.imageUrl;
        if (imageFile) {
            const result = await this.imageService.processProductImage(imageFile.buffer, imageFile.originalname);
            imageUrl = result.url;
        }
        const product = this.productRepo.create({ ...dto, imageUrl });
        return this.productRepo.save(product);
    }
    async findAll(search, categoryId) {
        const where = {};
        if (search)
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        if (categoryId)
            where.categoryId = categoryId;
        where.isAvailable = true;
        return this.productRepo.find({ where, order: { createdAt: 'DESC' } });
    }
    async findAllAdmin(search, categoryId) {
        const where = {};
        if (search)
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        if (categoryId)
            where.categoryId = categoryId;
        return this.productRepo.find({ where, order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const product = await this.productRepo.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, dto, imageFile) {
        const product = await this.findOne(id);
        if (imageFile) {
            if (product.imageUrl) {
                await this.imageService.deleteImage(product.imageUrl);
            }
            const result = await this.imageService.processProductImage(imageFile.buffer, imageFile.originalname);
            dto.imageUrl = result.url;
        }
        await this.productRepo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const product = await this.findOne(id);
        if (product.imageUrl) {
            await this.imageService.deleteImage(product.imageUrl);
        }
        await this.productRepo.delete(id);
    }
    async getTrending() {
        return this.productRepo.find({
            where: { isAvailable: true },
            order: { createdAt: 'DESC' },
            take: 8,
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        image_processing_service_1.ImageProcessingService])
], ProductsService);
//# sourceMappingURL=products.service.js.map