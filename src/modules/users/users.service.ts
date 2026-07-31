import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RoleEnum } from '../../common/enum/role.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>) { }


  async create(createUserDto: CreateUserDto) {
    const repo = this.userRepo;
    const existingUser = await repo.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const user = repo.create({
      ...createUserDto,
      role: RoleEnum.USER,
    });
    return repo.save(user);
  }


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
