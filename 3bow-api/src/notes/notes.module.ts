import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createPool } from 'mysql2/promise';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';


@Module({
  imports: [ConfigModule],
  controllers: [NotesController],
  providers: [
    NotesService,
    {
      provide: 'DB_POOL',
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        return createPool({
          host: cfg.get<string>('DB_HOST', '127.0.0.1'),
          port: Number(cfg.get<string>('DB_PORT', '3306')),
          user: cfg.get<string>('DB_USER', 'root'),
          password: cfg.get<string>('DB_PASS', ''),
          database: cfg.get<string>('DB_NAME', 'threebow'),
          connectionLimit: 10,
          charset: 'utf8mb4_unicode_ci',
        });
      },
    },
  ],
})
export class NotesModule {}