import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

import { PaginationQueryDto } from '../../common/pagination';

import { CreateAuthDto } from './dto/create-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import type { AuthUser } from './auth.service';
import { RefreshTokensService } from './refresh-tokens.service';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/** Stricter limit for credential endpoints (brute-force mitigation). */
const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@Controller('auth')
export class AuthController {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly refreshTokensService: RefreshTokensService) { }

  @Post('register')
  @Throttle(AUTH_THROTTLE)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.usersService.create(createAuthDto);

  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
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
  @UseGuards(JwtAuthGuard)
  fetchAllSessions(
    @Request() req: { user: AuthUser },
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.refreshTokensService.fetchAllSessions(req.user.id, pagination);
  }

  @Post('sessions/revoke-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  revokeAllSessions(@Request() req: { user: AuthUser }) {
    return this.refreshTokensService.revokeAllSessions(req.user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: { user: AuthUser }, @Body() logoutDto: LogoutDto) {
    const hashedToken = await this.authService.hashRefreshToken(logoutDto.refreshToken);
    return this.refreshTokensService.logout(req.user.id, hashedToken);
  }
}
