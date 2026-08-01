import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { EnvConfigService } from '../../config/env.config';
import ms, { StringValue } from 'ms';
import { createHash } from 'crypto';
import { JwtPayload } from './strategies/jwt.strategy';
import { RefreshTokensService } from './refresh-tokens.service';

export type AuthUser = Pick<
  User,
  | 'id'
  | 'name'
  | 'email'
  | 'isEmailVerified'
  | 'role'
  | 'isActive'
  | 'metadata'
  | 'createdAt'
  | 'updatedAt'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
    private readonly refreshTokensService: RefreshTokensService,
  ) { }

  async login(user: AuthUser) {
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.envConfigService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const hashedToken = await this.hashRefreshToken(refreshToken);
    const storedToken =
      await this.refreshTokensService.findValidByHashedToken(hashedToken);

    if (!storedToken || storedToken.user.id !== payload.sub) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.refreshTokensService.revoke(storedToken.id);

    const { password: _, ...userWithoutSecrets } = storedToken.user;

    return this.issueTokens(userWithoutSecrets);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const { password: _, ...result } = user;
    return result;
  }

  async hashRefreshToken(token: string): Promise<string> {
    return createHash('sha256').update(token).digest('hex');
  }

  private async issueTokens(user: AuthUser) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.envConfigService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.envConfigService.get(
        'JWT_REFRESH_EXPIRES_IN',
      ) as StringValue,
    });

    const accessTokenExp: StringValue = this.envConfigService.get(
      'JWT_ACCESS_EXPIRES_IN',
    ) as StringValue;
    const refreshTokenExp: StringValue = this.envConfigService.get(
      'JWT_REFRESH_EXPIRES_IN',
    ) as StringValue;

    await this.refreshTokensService.create(
      user.id,
      await this.hashRefreshToken(refreshToken),
      new Date(Date.now() + ms(refreshTokenExp)),
    );

    return {
      ...user,
      credentials: {
        accessToken,
        accessTokenExpiresInSeconds: ms(accessTokenExp) / 1000,
        refreshToken,
        refreshTokenExpiresInSeconds: ms(refreshTokenExp) / 1000,
      },
    };
  }
}
