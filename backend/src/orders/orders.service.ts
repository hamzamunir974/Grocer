import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async create(customerId: string, body: any): Promise<Order> {
    const order = this.orderRepo.create({
      customerId,
      items: body.items,
      totalInCents: body.totalInCents,
      deliveryAddress: body.deliveryAddress,
      status: OrderStatus.PENDING,
    });
    return this.orderRepo.save(order);
  }

  async findAll(user: User): Promise<Order[]> {
    if (user.role === UserRole.ADMIN) {
      return this.orderRepo.find({
        relations: ['customer', 'rider'],
        order: { createdAt: 'DESC' },
      });
    }
    if (user.role === UserRole.RIDER) {
      return this.orderRepo.find({
        where: { riderId: user.id },
        relations: ['customer'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.orderRepo.find({
      where: { customerId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'rider'],
    });
    if (!order) throw new NotFoundException('Order not found');

    if (
      user.role !== UserRole.ADMIN &&
      order.customerId !== user.id &&
      order.riderId !== user.id
    ) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    user: User,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    order.status = status;
    return this.orderRepo.save(order);
  }

  async assignRider(orderId: string, riderId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    order.riderId = riderId;
    order.status = OrderStatus.CONFIRMED;
    return this.orderRepo.save(order);
  }

  async updateRiderLocation(
    orderId: string,
    lat: number,
    lng: number,
  ): Promise<Order> {
    await this.orderRepo.update(orderId, { riderLat: lat, riderLng: lng });
    return this.orderRepo.findOne({ where: { id: orderId } }) as Promise<Order>;
  }
}
