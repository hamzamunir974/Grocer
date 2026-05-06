import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerStart(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing && existing.isVerified) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (existing) {
      // Update existing unverified user
      await this.usersService.update(existing.id, {
        ...dto,
        password: hashedPassword,
        otpCode: pin,
        otpExpiresAt: expiresAt,
      });
    } else {
      await this.usersService.create({
        ...dto,
        password: hashedPassword,
        otpCode: pin,
        otpExpiresAt: expiresAt,
        isVerified: false,
      });
    }

    console.log(`\n📧 [REGISTRATION PIN] for ${dto.email}: ${pin}\n`);
    return { message: 'PIN sent to email' };
  }

  async registerVerify(email: string, pin: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.otpCode !== pin || new Date() > user.otpExpiresAt) {
      throw new UnauthorizedException('Invalid or expired PIN');
    }

    await this.usersService.update(user.id, {
      isVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    const { password, ...result } = user;
    return result;
  }

  async validateGoogleUser(googleUser: any) {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      // Create new user if they don't exist
      user = await this.usersService.create({
        email: googleUser.email,
        fullName: googleUser.fullName,
        password: Math.random().toString(36).slice(-12), // Temporary password
        isActive: true,
        isVerified: false, // Must verify with PIN
      });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async sendOtp(email: string) {
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      // Auto-register as customer if not found
      user = await this.usersService.create({
        email,
        fullName: email.split('@')[0],
        password: Math.random().toString(36).slice(-12),
        role: 'customer' as any,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.usersService.update(user.id, {
      otpCode: otp,
      otpExpiresAt: expiresAt,
    });

    console.log(`\n📧 [MOCK EMAIL] OTP for ${email}: ${otp}\n`);
    return { message: 'OTP sent to email' };
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.otpCode !== code || new Date() > user.otpExpiresAt) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Clear OTP after use
    await this.usersService.update(user.id, {
      otpCode: null,
      otpExpiresAt: null,
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
