import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
export declare class OrdersService {
    private orderRepo;
    private usersService;
    constructor(orderRepo: Repository<Order>, usersService: UsersService);
    create(customerId: string, body: any): Promise<Order>;
    findAll(user: User): Promise<Order[]>;
    findOne(id: string, user: User): Promise<Order>;
    updateStatus(id: string, status: OrderStatus, user: User): Promise<Order>;
    assignRider(orderId: string, riderId: string): Promise<Order>;
    updateRiderLocation(orderId: string, lat: number, lng: number): Promise<Order>;
    getStats(): Promise<{
        totalOrders: number;
        revenue: number;
        activeOrders: number;
        totalRiders: number;
    }>;
}
