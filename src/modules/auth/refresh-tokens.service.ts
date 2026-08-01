import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async fetchAllSessions(userId: string, { skip, take }:
    { skip: number, take: number }): Promise<{ data: RefreshToken[], total: number, page: number, limit: number }> {

    const data = await this.refreshTokenRepo.findAndCount({ where: { user: { id: userId } }, skip, take });
    return { data: data[0], total: data[1], page: skip, limit: take };

  }
}
