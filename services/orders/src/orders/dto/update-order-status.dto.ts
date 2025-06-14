import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'The new status of the order',
    enum: OrderStatus,
    example: OrderStatus.IN_PROCESS,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
} 