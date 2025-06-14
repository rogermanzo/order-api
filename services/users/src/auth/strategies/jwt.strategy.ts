import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('Estrategia JWT - Payload completo:', payload);
    
    // Asegurarnos de que sub existe
    if (!payload.sub) {
      console.log('Estrategia JWT - Error: sub no existe en el payload');
      throw new Error('Invalid token payload');
    }

    // Convert ID to number to avoid NaN issues
    const userId = Number(payload.sub);
    
    const user = {
      id: userId,
      email: payload.email
    };
    
    console.log('Estrategia JWT - Usuario a devolver:', user);
    return user;
  }
}