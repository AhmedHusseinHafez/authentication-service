import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { CreateAuthDto } from './dto/create-auth.dto';

import { UsersService } from '../users/users.service';


import { User } from '../users/entities/user.entity';



@Controller('auth')
export class AuthController {

  constructor(
    private readonly usersService: UsersService) { }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.usersService.create(createAuthDto);

  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  login(@Request() req: { user: Omit<User, 'password'> }) {
    return req.user;
  }
}
