import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) return null;
    return { id: user.id, email: user.email, role: user.role, cancelCount: user.cancelCount };
  }
}
