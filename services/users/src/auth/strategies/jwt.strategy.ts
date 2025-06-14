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
    // Make sure sub exists
    if (!payload.sub) {
      console.log('JWT Strategy - Error: sub does not exist in payload');
      throw new Error('Invalid token payload');
    }

    // Convert ID to number to avoid NaN issues
    const userId = Number(payload.sub);
    
    return {
      id: userId,
      email: payload.email
    };
  }
}