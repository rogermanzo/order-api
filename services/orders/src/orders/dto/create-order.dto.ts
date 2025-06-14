import { IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: 1,
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'The quantity of the product',
    example: 2,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The price of the product',
    example: 29.99,
  })
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'The ID of the user who created the order',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'The items in the order',
    type: [OrderItemDto],
    example: [
      {
        productId: 1,
        quantity: 2,
        price: 29.99
      }
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'The total amount of the order',
    example: 59.98,
  })
  @IsNumber()
  total: number;
} 