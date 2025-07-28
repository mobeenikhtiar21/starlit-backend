import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const token = await this.authService.login(body.email, body.password);
    if (!token) throw new UnauthorizedException('Invalid credentials');
    return { access_token: token };
  }

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string; role?: string }) {
    const token = await this.authService.register(body);
    return { access_token: token };
  }
} 