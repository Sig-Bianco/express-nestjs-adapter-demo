import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('user')
  create(): string {
    return this.appService.createUser();
  }

  @Get('users')
  findAll(): string {
    return this.appService.listUsers();
  }
}
