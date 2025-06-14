import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EventsService } from '../events/events.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });

    await this.eventsService.publishUserCreated(user);
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string, withPassword = false): Promise<any> {
    try {
      this.logger.debug(`Servicio - Buscando usuario por email: ${email}`);
      
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
        this.logger.error(`Servicio - Usuario no encontrado con email: ${email}`);
      throw new NotFoundException('User not found');
    }

    if (withPassword) {
      return user;
    }

    const { password, ...result } = user;
      this.logger.debug(`Servicio - Usuario encontrado: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Servicio - Error al buscar usuario por email: ${error.message}`);
      throw error;
    }
  }

  async getProfileFromToken(token: string) {
    try {
      this.logger.debug(`Servicio - Token recibido: ${token}`);
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      this.logger.debug(`Servicio - Token decodificado manualmente: ${JSON.stringify(decoded)}`);
      
      if (!decoded || !decoded.sub) {
        throw new NotFoundException('Invalid token');
      }

      const userId = decoded.sub;
      this.logger.debug(`Servicio - ID del usuario: ${userId}`);

    const user = await this.prisma.user.findUnique({
        where: { id: userId },
    });

      this.logger.debug(`Servicio - Usuario encontrado: ${JSON.stringify(user)}`);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
    } catch (error) {
      this.logger.error(`Servicio - Error al procesar el token: ${error.message}`);
      throw new NotFoundException('Error processing token');
    }
  }
} 