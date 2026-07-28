import { Controller, Get, HttpException, HttpStatus, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ path: 'api' })
export class AppController {
  constructor(private readonly appService: AppService) { }

  
  @Get(':id')
  getById(@Param() params: { id: string }): string {
    return this.appService.getById(params.id);
  }
  
  @Get()
  getHello(@Req() request: Request): string {
    console.log(request.url);
    return this.appService.getHello();
  }
}
