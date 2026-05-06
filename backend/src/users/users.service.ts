import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ select: ['id', 'email', 'fullName', 'role', 'phone', 'isActive', 'createdAt'] as any });
  }

  async findRiders(): Promise<User[]> {
    return this.userRepo.find({
      where: { role: 'rider' as any },
      select: ['id', 'email', 'fullName', 'phone', 'isActive'] as any,
    });
  }

  async countRiders(): Promise<number> {
    return this.userRepo.count({ where: { role: 'rider' as any } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }
}
