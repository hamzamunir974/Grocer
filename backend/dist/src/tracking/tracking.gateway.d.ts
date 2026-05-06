import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
interface LocationUpdate {
    orderId: string;
    lat: number;
    lng: number;
    riderId: string;
}
export declare class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(data: {
        orderId: string;
    }, client: Socket): void;
    handleLocationUpdate(data: LocationUpdate, client: Socket): void;
    handleOrderDelivered(data: {
        orderId: string;
        riderId: string;
    }, client: Socket): void;
}
export {};
