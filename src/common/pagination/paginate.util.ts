import { ObjectLiteral, Repository, FindManyOptions } from 'typeorm';

import { PaginationQueryDto } from './pagination-query.dto';
import {
  createPaginatedResponse,
  PaginatedResponse,
} from './paginated-response.interface';

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  pagination: PaginationQueryDto,
  options: FindManyOptions<T> = {},
): Promise<PaginatedResponse<T>> {
  const [data, total] = await repository.findAndCount({
    ...options,
    skip: pagination.skip,
    take: pagination.take,
  });

  return createPaginatedResponse(
    data,
    total,
    pagination.page,
    pagination.limit,
  );
}
