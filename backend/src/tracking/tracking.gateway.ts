import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface LocationUpdate {
  orderId: string;
  lat: number;
  lng: number;
  riderId: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/tracking',
})
export class TrackingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Customer joins an order room to receive live updates
   */
  @SubscribeMessage('joinOrderRoom')
  handleJoinRoom(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `order_room_${data.orderId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    client.emit('joinedRoom', { room, orderId: data.orderId });
  }

  /**
   * Rider emits location update → broadcast ONLY to the customer in order_room
   */
  @SubscribeMessage('locationUpdate')
  handleLocationUpdate(
    @MessageBody() data: LocationUpdate,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `order_room_${data.orderId}`;
    this.logger.log(
      `Rider ${data.riderId} location: [${data.lat}, ${data.lng}] → ${room}`,
    );

    // Broadcast to all in the room EXCEPT the rider themselves
    client.to(room).emit('riderLocationUpdated', {
      orderId: data.orderId,
      lat: data.lat,
      lng: data.lng,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Rider marks order as delivered
   */
  @SubscribeMessage('orderDelivered')
  handleOrderDelivered(
    @MessageBody() data: { orderId: string; riderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `order_room_${data.orderId}`;
    this.server.to(room).emit('orderStatusChanged', {
      orderId: data.orderId,
      status: 'delivered',
      timestamp: new Date().toISOString(),
    });
  }
}
