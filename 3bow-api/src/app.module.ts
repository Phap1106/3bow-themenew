import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LeadsModule } from './leads/leads.module';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Đọc .env toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Kết nối DB qua env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get<string>('DB_HOST', '127.0.0.1'),
        port: Number(cfg.get<string>('DB_PORT', '3306')),
        username: cfg.get<string>('DB_USER', 'root'),
        password: cfg.get<string>('DB_PASS', ''),
        database: cfg.get<string>('DB_NAME', 'threebow'),
        // dùng autoLoadEntities để không phải liệt kê thủ công
        autoLoadEntities: true,
        synchronize: false, // chỉ bật true trong DEV khi cần tạo bảng
        charset: 'utf8mb4_unicode_ci',
      }),
    }),

    LeadsModule,
    UsersModule,
    ArticlesModule,
    AuthModule,
  ],
})
export class AppModule {}
