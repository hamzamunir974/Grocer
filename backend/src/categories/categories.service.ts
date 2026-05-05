import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async findOne(id: string): Promise<Category> {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const cat = this.categoryRepo.create(data);
    return this.categoryRepo.save(cat);
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    await this.findOne(id);
    await this.categoryRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.categoryRepo.delete(id);
  }
}
