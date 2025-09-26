import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from 'src/common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 190, unique: true })
  @Index()
  email!: string;

  // Map tới cột DB `password`
  @Column({ name: 'password', type: 'varchar', length: 255, select: true })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  firstName?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  lastName?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string | null;

  @Column({ type: 'varchar', length: 32, default: UserRole.USER })
  role!: UserRole;

  @Column({ type: 'int', default: 0 })
  sessionVersion!: number;

  @Column({ type: 'datetime', nullable: true })
  lockedUntil?: Date | null;

  @Column({ type: 'int', default: 0 })
  loginAttemptCount!: number;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAttemptAt?: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
