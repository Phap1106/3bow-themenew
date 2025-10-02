import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('email_login_challenges')
export class EmailLoginChallenge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36 })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', length: 255, default: '' })
  codeHash!: string;

  @Column({ type: 'datetime' })
  expiresAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  usedAt?: Date | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nextPath?: string | null;

  @Column({ type: 'datetime' })
  lastSentAt!: Date;

  @Column({ type: 'int', default: 0 })
  sentCount!: number;

  @Column({ type: 'int', default: 0 })
  verifyCount!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
