import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';
import { EventsService } from '../events/events.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        status: OrderStatus.PENDING,
        items: {
          create: createOrderDto.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        },
        total: createOrderDto.total
      },
      include: {
        items: true
      }
    });

    await this.eventsService.publishOrderCreated(order);
    return order;
  }

  async findAllByUserId(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status },
      include: {
        items: true
      }
    });

    await this.eventsService.publishOrderStatusUpdated(updatedOrder);
    return updatedOrder;
  }
} 