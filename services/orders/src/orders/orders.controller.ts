import { Controller, Post, Body, Get, Param, Patch, UseGuards, Request, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders for a user' })
  @ApiResponse({ status: 200, description: 'Orders found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findAllByUserId(@Param('userId') userId: string) {
    return this.ordersService.findAllByUserId(+userId);
  }

  @Put(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status successfully updated.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(+id, updateOrderStatusDto);
  }
} 