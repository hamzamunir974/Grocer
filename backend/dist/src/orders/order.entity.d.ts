import { User } from '../users/user.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: string;
    customer: User;
    customerId: string;
    rider: User;
    riderId: string;
    status: OrderStatus;
    items: Array<{
        productId: string;
        name: string;
        priceInCents: number;
        quantity: number;
        imageUrl?: string;
    }>;
    totalInCents: number;
    deliveryAddress: string;
    riderLat: number;
    riderLng: number;
    estimatedDelivery: string;
    createdAt: Date;
    updatedAt: Date;
}
