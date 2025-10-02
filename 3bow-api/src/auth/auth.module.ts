// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from 'src/users/user.entity';
import { EmailLoginChallenge } from './email-login-challenge.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module'; // <— THÊM

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailLoginChallenge]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '7d' },
    }),
    MailerModule, // <— THÊM
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    console.log('[AuthModule] loaded');
  }
}
