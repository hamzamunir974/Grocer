import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column()
  customerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'riderId' })
  rider: User;

  @Column({ nullable: true })
  riderId: string;

  @Column({
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'simple-json' })
  items: Array<{
    productId: string;
    name: string;
    priceInCents: number;
    quantity: number;
    imageUrl?: string;
  }>;

  @Column({ type: 'int', comment: 'Total in cents' })
  totalInCents: number;

  @Column({ type: 'text' })
  deliveryAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  riderLat: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  riderLng: number;

  @Column({ nullable: true })
  estimatedDelivery: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
