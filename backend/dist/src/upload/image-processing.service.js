"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessingService = void 0;
const common_1 = require("@nestjs/common");
const sharp_1 = __importDefault(require("sharp"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let ImageProcessingService = class ImageProcessingService {
    uploadDir;
    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || './uploads';
        this.ensureUploadDir();
    }
    ensureUploadDir() {
        const productsDir = path.join(this.uploadDir, 'products');
        if (!fs.existsSync(productsDir)) {
            fs.mkdirSync(productsDir, { recursive: true });
        }
    }
    async processProductImage(buffer, filename) {
        const outputFilename = `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}.webp`;
        const outputPath = path.join(this.uploadDir, 'products', outputFilename);
        const metadata = await (0, sharp_1.default)(buffer).metadata();
        const { width = 800, height = 800 } = metadata;
        const size = Math.min(width, height);
        let processedBuffer = await (0, sharp_1.default)(buffer)
            .extract({
            left: Math.floor((width - size) / 2),
            top: Math.floor((height - size) / 2),
            width: size,
            height: size,
        })
            .resize(800, 800)
            .webp({ quality: 80 })
            .toBuffer();
        let quality = 70;
        while (processedBuffer.length > 1 * 1024 * 1024 && quality > 20) {
            processedBuffer = await (0, sharp_1.default)(buffer)
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
    async deleteImage(imageUrl) {
        if (!imageUrl)
            return;
        const filepath = path.join(process.cwd(), imageUrl);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
};
exports.ImageProcessingService = ImageProcessingService;
exports.ImageProcessingService = ImageProcessingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ImageProcessingService);
//# sourceMappingURL=image-processing.service.js.map