import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    create(data: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    findAll(): Promise<User[]>;
    findRiders(): Promise<User[]>;
    countRiders(): Promise<number>;
    update(id: string, data: Partial<User>): Promise<User>;
}
