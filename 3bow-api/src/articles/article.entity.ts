//src/articles/article.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  @Index()
  title!: string;

  @Column({ type: 'varchar', length: 220, unique: true })
  @Index()
  slug!: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string | null;

  @Column({ type: 'longtext' })
  content!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  image?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  author?: string | null;

  @Column({ type: 'datetime', nullable: true })
  publishedAt?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
