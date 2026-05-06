import { OrdersService } from './orders.service';
import { OrderStatus } from './order.entity';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    getStats(): Promise<{
        totalOrders: number;
        revenue: number;
        activeOrders: number;
        totalRiders: number;
    }>;
    findAll(req: any): Promise<import("./order.entity").Order[]>;
    findOne(id: string, req: any): Promise<import("./order.entity").Order>;
    create(body: any, req: any): Promise<import("./order.entity").Order>;
    updateStatus(id: string, status: OrderStatus, req: any): Promise<import("./order.entity").Order>;
    assignRider(id: string, riderId: string): Promise<import("./order.entity").Order>;
    updateLocation(id: string, body: {
        lat: number;
        lng: number;
    }): Promise<import("./order.entity").Order>;
}
