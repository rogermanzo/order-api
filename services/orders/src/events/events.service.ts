import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  async publishOrderCreated(order: Order) {
    return this.natsClient.emit('order.created', order);
  }

  async publishOrderStatusUpdated(order: Order) {
    return this.natsClient.emit('order.status.updated', order);
  }
} 