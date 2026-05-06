import { Product } from '../products/product.entity';
export declare class Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    sortOrder: number;
    products: Product[];
    createdAt: Date;
}
