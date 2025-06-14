import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';

@Injectable()
export class ProfileGuard implements CanActivate {
  private readonly logger = new Logger(ProfileGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const token = authHeader.split(' ')[1];
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      
      if (!decoded || !decoded.email) {
        throw new UnauthorizedException('Invalid token');
      }

      request.user = { email: decoded.email };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 