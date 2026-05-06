import { UsersService } from './users/users.service';
import { OnModuleInit } from '@nestjs/common';
export declare class AppModule implements OnModuleInit {
    private readonly usersService;
    constructor(usersService: UsersService);
    onModuleInit(): Promise<void>;
}
