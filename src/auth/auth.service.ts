import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);

    const role: 'ADMIN' | 'CUSTOMER' = dto.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';

    const user = await this.usersService.create({
      email: dto.email,
      password: hash,
      role,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      secret: process.env.JWT_SECRET,
    });

    return { access_token };
  }
}
