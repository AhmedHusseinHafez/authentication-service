import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  PaginatedResponse,
  PaginationQueryDto,
  paginate,
} from '../../common/pagination';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) { }

  async create(userId: string, hashedToken: string, expiresAt: Date) {
    const refreshToken = this.refreshTokenRepo.create({
      user: { id: userId },
      hashedToken,
      expiresAt,
    });
    return this.refreshTokenRepo.save(refreshToken);
  }

  async findValidByHashedToken(
    hashedToken: string,
  ): Promise<RefreshToken | null> {
    return this.refreshTokenRepo
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.user', 'user')
      .where('token.hashedToken = :hashedToken', { hashedToken })
      .andWhere('token.revokedAt IS NULL')
      .andWhere('token.expiresAt > :now', { now: new Date() })
      .getOne();
  }

  async revoke(id: string): Promise<void> {
    await this.refreshTokenRepo.update(id, { revokedAt: new Date() });
  }

  async revokeAllSessions(userId: string): Promise<{ success: boolean, message: string }> {
    const revoking = await this.refreshTokenRepo.update({ user: { id: userId } }, { revokedAt: new Date() });
    if (revoking.affected === 0) {
      throw new NotFoundException('No sessions found');
    }
    return revoking.affected ? {
      success: true,
      message: 'All sessions revoked successfully',
    } : {
      success: false,
      message: 'No sessions found',
    };
  }

  async logout(userId: string, hashedToken: string): Promise<{ success: boolean, message: string }> {
    const revoking = await this.refreshTokenRepo.update({ user: { id: userId }, hashedToken: hashedToken }, { revokedAt: new Date() });
    if (revoking.affected === 0) {
      throw new NotFoundException('Session not found');
    }
    return revoking.affected ? {
      success: true,
      message: 'Session revoked successfully',
    } : {
      success: false,
      message: 'Session not found',
    };
  }

  async fetchAllSessions(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponse<RefreshToken>> {
    return paginate(this.refreshTokenRepo, pagination, {
      where: { user: { id: userId } },
      order: { expiresAt: 'DESC' },
    });
  }
}
