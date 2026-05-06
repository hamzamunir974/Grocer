"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcryptjs"));
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    mailService;
    constructor(usersService, jwtService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async registerStart(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing && existing.isVerified) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        if (existing) {
            await this.usersService.update(existing.id, {
                ...dto,
                password: hashedPassword,
                otpCode: pin,
                otpExpiresAt: expiresAt,
            });
        }
        else {
            await this.usersService.create({
                ...dto,
                password: hashedPassword,
                otpCode: pin,
                otpExpiresAt: expiresAt,
                isVerified: false,
            });
        }
        await this.mailService.sendPin(dto.email, pin);
        return { message: 'PIN sent to email' };
    }
    async registerVerify(email, pin) {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.otpCode !== pin || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
            throw new common_1.UnauthorizedException('Invalid or expired PIN');
        }
        await this.usersService.update(user.id, {
            isVerified: true,
            otpCode: undefined,
            otpExpiresAt: undefined,
        });
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is disabled');
        }
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('Please verify your email first');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        const { password, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
    async getProfile(userId) {
        const user = await this.usersService.findById(userId);
        const { password, ...result } = user;
        return result;
    }
    async validateGoogleUser(googleUser) {
        let user = await this.usersService.findByEmail(googleUser.email);
        if (!user) {
            user = await this.usersService.create({
                email: googleUser.email,
                fullName: googleUser.fullName,
                password: Math.random().toString(36).slice(-12),
                isActive: true,
                isVerified: true,
            });
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async sendOtp(email) {
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            user = await this.usersService.create({
                email,
                fullName: email.split('@')[0],
                password: Math.random().toString(36).slice(-12),
                role: 'customer',
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersService.update(user.id, {
            otpCode: otp,
            otpExpiresAt: expiresAt,
        });
        console.log(`\n📧 [MOCK EMAIL] OTP for ${email}: ${otp}\n`);
        return { message: 'OTP sent to email' };
    }
    async verifyOtp(email, code) {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.otpCode !== code || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        await this.usersService.update(user.id, {
            otpCode: undefined,
            otpExpiresAt: undefined,
        });
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map