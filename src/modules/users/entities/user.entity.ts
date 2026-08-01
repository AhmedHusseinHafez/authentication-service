import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RoleEnum } from "../../../common/enum/role.enum";
import { RefreshToken } from "../../auth/entities/refresh-token.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    unique: true, transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value.toLowerCase(),
    }
  })
  @Index() //for faster lookup
  email!: string;


  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: 'user',
  })
  role!: string;

  @Column({ default: false })
  isActive!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @Column({ select: false })
  password!: string;

  // @Column({ type: 'varchar', nullable: true, select: false })
  // hashedRefreshToken?: string | null;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn() // soft delete
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}