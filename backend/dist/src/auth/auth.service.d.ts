import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService);
    registerStart(dto: RegisterDto): Promise<{
        message: string;
    }>;
    registerVerify(email: string, pin: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            address: string;
            role: import("../users/user.entity").UserRole;
            isActive: boolean;
            isVerified: boolean;
            otpCode?: string;
            otpExpiresAt?: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            address: string;
            role: import("../users/user.entity").UserRole;
            isActive: boolean;
            isVerified: boolean;
            otpCode?: string;
            otpExpiresAt?: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string;
        address: string;
        role: import("../users/user.entity").UserRole;
        isActive: boolean;
        isVerified: boolean;
        otpCode?: string;
        otpExpiresAt?: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validateGoogleUser(googleUser: any): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            address: string;
            role: import("../users/user.entity").UserRole;
            isActive: boolean;
            isVerified: boolean;
            otpCode?: string;
            otpExpiresAt?: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    sendOtp(email: string): Promise<{
        message: string;
    }>;
    verifyOtp(email: string, code: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string;
            address: string;
            role: import("../users/user.entity").UserRole;
            isActive: boolean;
            isVerified: boolean;
            otpCode?: string;
            otpExpiresAt?: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
}
