"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const user_entity_1 = require("../users/user.entity");
const users_service_1 = require("../users/users.service");
let OrdersService = class OrdersService {
    orderRepo;
    usersService;
    constructor(orderRepo, usersService) {
        this.orderRepo = orderRepo;
        this.usersService = usersService;
    }
    async create(customerId, body) {
        const order = this.orderRepo.create({
            customerId,
            items: body.items,
            totalInCents: body.totalInCents,
            deliveryAddress: body.deliveryAddress,
            status: order_entity_1.OrderStatus.PENDING,
        });
        return this.orderRepo.save(order);
    }
    async findAll(user) {
        if (user.role === user_entity_1.UserRole.ADMIN) {
            return this.orderRepo.find({
                relations: ['customer', 'rider'],
                order: { createdAt: 'DESC' },
            });
        }
        if (user.role === user_entity_1.UserRole.RIDER) {
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
    async findOne(id, user) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['customer', 'rider'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (user.role !== user_entity_1.UserRole.ADMIN &&
            order.customerId !== user.id &&
            order.riderId !== user.id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return order;
    }
    async updateStatus(id, status, user) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.status = status;
        return this.orderRepo.save(order);
    }
    async assignRider(orderId, riderId) {
        const order = await this.orderRepo.findOne({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.riderId = riderId;
        order.status = order_entity_1.OrderStatus.CONFIRMED;
        const estimate = new Date();
        estimate.setMinutes(estimate.getMinutes() + 30);
        order.estimatedDelivery = estimate.toISOString();
        return this.orderRepo.save(order);
    }
    async updateRiderLocation(orderId, lat, lng) {
        await this.orderRepo.update(orderId, { riderLat: lat, riderLng: lng });
        return this.orderRepo.findOne({ where: { id: orderId } });
    }
    async getStats() {
        const totalOrders = await this.orderRepo.count();
        const orders = await this.orderRepo.find();
        const revenue = orders.reduce((acc, o) => acc + o.totalInCents, 0);
        const activeOrders = orders.filter((o) => o.status !== order_entity_1.OrderStatus.DELIVERED && o.status !== order_entity_1.OrderStatus.CANCELLED).length;
        const totalRiders = await this.usersService.countRiders();
        return {
            totalOrders,
            revenue,
            activeOrders,
            totalRiders,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map