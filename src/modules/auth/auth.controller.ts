import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';

import { PaginationQueryDto } from '../../common/pagination';

import { AuthGuard } from '@nestjs/passport';

import { CreateAuthDto } from './dto/create-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import type { AuthUser } from './auth.service';
import { RefreshTokensService } from './refresh-tokens.service';
import { LogoutDto } from './dto/logout.dto';



@Controller('auth')
export class AuthController {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly refreshTokensService: RefreshTokensService) { }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.usersService.create(createAuthDto);

  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  login(@Request() req: { user: AuthUser }) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Get('sessions')
  @UseGuards(AuthGuard('jwt'))
  fetchAllSessions(
    @Request() req: { user: AuthUser },
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.refreshTokensService.fetchAllSessions(req.user.id, pagination);
  }

  @Post('sessions/revoke-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  revokeAllSessions(@Request() req: { user: AuthUser }) {
    return this.refreshTokensService.revokeAllSessions(req.user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req: { user: AuthUser }, @Body() logoutDto: LogoutDto) {
    const hashedToken = await this.authService.hashRefreshToken(logoutDto.refreshToken);
    return this.refreshTokensService.logout(req.user.id, hashedToken);
  }
}
