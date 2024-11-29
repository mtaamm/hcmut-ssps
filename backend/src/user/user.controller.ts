import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.userService.login(username, password);
  }
}
