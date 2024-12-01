import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.userService.login(username, password);
  }

  @Post('buy-page')
  async buyPage(
    @Body('uid') uid: string,
    @Body('page_size') pageSize: string,
    @Body('page') page: number,
  ) {
    return this.userService.buyPage(uid, pageSize, page);
  }

  @Get('get-student-activities')
  async getStudentActivities(@Query('spso_id') spso_id: string) {
    if (!spso_id) {
      return {
        status: 'unsuccess',
        message: 'SPSO ID là bắt buộc',
      };
    }

    return this.userService.getStudentActivities(spso_id);
  }
}
