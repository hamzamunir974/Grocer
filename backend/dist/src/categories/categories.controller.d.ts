import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("./category.entity").Category[]>;
    findOne(id: string): Promise<import("./category.entity").Category>;
    create(body: any): Promise<import("./category.entity").Category>;
    update(id: string, body: any): Promise<import("./category.entity").Category>;
    remove(id: string): Promise<void>;
}
