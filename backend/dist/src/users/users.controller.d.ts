import { UserRole } from './user.entity';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    create(dto: any): Promise<import("./user.entity").User>;
    findRiders(): Promise<import("./user.entity").User[]>;
    updateRole(id: string, role: UserRole): Promise<import("./user.entity").User>;
}
