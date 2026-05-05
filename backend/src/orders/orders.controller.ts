import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { OrderStatus } from './order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.ordersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.ordersService.findOne(id, req.user);
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.ordersService.create(req.user.id, body);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RIDER)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: OrderStatus,
    @Req() req: any,
  ) {
    return this.ordersService.updateStatus(id, status, req.user);
  }

  @Patch(':id/assign-rider')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  assignRider(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('riderId') riderId: string,
  ) {
    return this.ordersService.assignRider(id, riderId);
  }

  @Patch(':id/location')
  @UseGuards(RolesGuard)
  @Roles(UserRole.RIDER)
  updateLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { lat: number; lng: number },
  ) {
    return this.ordersService.updateRiderLocation(id, body.lat, body.lng);
  }
}
