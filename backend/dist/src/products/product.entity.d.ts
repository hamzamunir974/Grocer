import { Category } from '../categories/category.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    priceInCents: number;
    stock: number;
    imageUrl: string;
    isAvailable: boolean;
    unit: string;
    category: Category;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
}
