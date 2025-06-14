import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;
  let eventsService: EventsService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockEventsService = {
    publishOrderCreated: jest.fn(),
    publishOrderStatusUpdated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    eventsService = module.get<EventsService>(EventsService);
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
      mockEventsService.publishOrderCreated.mockResolvedValue(undefined);

      const result = await service.create(createOrderDto);
      expect(result).toEqual(expectedOrder);
      expect(mockEventsService.publishOrderCreated).toHaveBeenCalledWith(expectedOrder);
    });
  });
}); 