import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        userId: 1,
        items: [
          {
            productId: 1,
            quantity: 2,
            price: 29.99
          }
        ],
        total: 59.98
      };

      const expectedOrder = {
        id: 1,
        ...createOrderDto,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaService.order.create.mockResolvedValue(expectedOrder);

      const result = await service.create(createOrderDto);
      expect(result).toEqual(expectedOrder);
    });
  });
}); 