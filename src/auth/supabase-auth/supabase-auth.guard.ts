import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Invalid or missing authorization header");
    }
    const token = authHeader.split(" ")[1];
    const jwtsecret = this.configService.get("SUPABASE_JWT_SECRET");
    if (!jwtsecret) {
      throw new Error("SUPABASE_JWT_SECRET is not found");
    }
    try {
      const decoded = jwt.verify(token, jwtsecret);
      request["user"] = decoded;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
    return true;
  }
}
