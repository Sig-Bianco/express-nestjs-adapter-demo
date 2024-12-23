import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('cats')
  create(): string {
    return 'Cria novos gatos';
  }

  @Get('cats')
  findAll(): string {
    return 'Retorna todos os gatos';
  }
}
