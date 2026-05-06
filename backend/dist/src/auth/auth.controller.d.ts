import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registerStart(dto: RegisterDto): Promise<{
        message: string;
    }>;
    registerVerify(email: string, pin: string, res: Response): Promise<{
        message: string;
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
    login(dto: LoginDto, res: Response): Promise<{
        message: string;
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
    logout(res: Response): {
        message: string;
    };
    getProfile(req: Request): Promise<{
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
    googleAuth(req: any): Promise<void>;
    googleDemo(res: Response): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    sendOtp(email: string): Promise<{
        message: string;
    }>;
    verifyOtp(email: string, code: string, res: Response): Promise<{
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
