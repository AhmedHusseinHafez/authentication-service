import { Transform, Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  get take(): number {
    return this.limit;
  }
}
