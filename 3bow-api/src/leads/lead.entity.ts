//src/leads/lead.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { BudgetRange, LeadChannel, LeadStatus, ServiceType } from './enums';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 }) @Index() name!: string;
  @Column({ type: 'varchar', length: 20 })  @Index() phone!: string;

  @Column({ type: 'varchar', length: 190, nullable: true }) @Index()
  email?: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true }) url?: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })  service?: ServiceType | null;
  @Column({ type: 'varchar', length: 200, nullable: true }) serviceText?: string | null;
  @Column({ type: 'varchar', length: 40, nullable: true })  budget?: BudgetRange | null;

  @Column({ type: 'text', nullable: true }) note?: string | null;

  @Column({ type: 'tinyint', width: 1, default: 0 }) consent!: boolean;

  @Column({ type: 'varchar', length: 40, nullable: true }) channel?: LeadChannel | null;

  @Column({ type: 'varchar', length: 255, nullable: true }) utmSource?: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) utmMedium?: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) utmCampaign?: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) utmTerm?: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) utmContent?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true }) referrer?: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) pagePath?: string | null;
  @Column({ type: 'varchar', length: 100, nullable: true }) ip?: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) userAgent?: string | null;

  @Column({ type: 'varchar', length: 32, default: LeadStatus.NEW }) @Index()
  status!: LeadStatus;

  @Column({ type: 'varchar', length: 100, nullable: true }) assignedToId?: string | null;

  @CreateDateColumn() @Index() createdAt!: Date;
  @UpdateDateColumn()            updatedAt!: Date;
}
