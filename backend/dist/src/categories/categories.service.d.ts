import { Repository } from 'typeorm';
import { Category } from './category.entity';
export declare class CategoriesService {
    private categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(data: Partial<Category>): Promise<Category>;
    update(id: string, data: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<void>;
}
