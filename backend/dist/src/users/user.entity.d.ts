export declare enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin",
    RIDER = "rider"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    address: string;
    role: UserRole;
    isActive: boolean;
    isVerified: boolean;
    otpCode?: string;
    otpExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
