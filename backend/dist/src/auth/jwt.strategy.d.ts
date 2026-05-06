import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    private config;
    constructor(usersService: UsersService, config: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<import("../users/user.entity").User>;
}
export {};
