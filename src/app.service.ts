import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  
  getById(id: string): string {
    return `Hello World! ${id}`;
  }
}
