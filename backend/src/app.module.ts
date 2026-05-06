import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { TrackingGateway } from './tracking/tracking.gateway';
import { AppController } from './app.controller';

import { UsersService } from './users/users.service';
import { OnModuleInit } from '@nestjs/common';
import { UserRole } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true, // Auto-create tables for SQLite dev
      logging: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    UploadModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [TrackingGateway],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    try {
      const users = await this.usersService.findAll();
      if (users.length === 0) {
        console.log('🌱 Seeding database with default accounts...');
        // Admin
        await this.usersService.create({
          fullName: 'Admin User',
          email: 'admin@grocerx.com',
          password: 'password123',
          role: UserRole.ADMIN,
        });
        // Rider
        await this.usersService.create({
          fullName: 'Rider User',
          email: 'rider@grocerx.com',
          password: 'password123',
          role: UserRole.RIDER,
        });
        // Customer
        await this.usersService.create({
          fullName: 'Customer User',
          email: 'customer@grocerx.com',
          password: 'password123',
          role: UserRole.CUSTOMER,
        });
        console.log('✅ Seeding complete!');
      }
    } catch (err) {
      console.error('❌ Seeding failed:', err.message);
    }
  }
}
