export declare class CreateProductDto {
    name: string;
    description?: string;
    priceInCents: number;
    stock: number;
    unit?: string;
    categoryId: string;
    imageUrl?: string;
    isAvailable?: boolean;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    priceInCents?: number;
    stock?: number;
    unit?: string;
    categoryId?: string;
    imageUrl?: string;
    isAvailable?: boolean;
}
