// // src/auth/auth.module.ts
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller'; // nếu có
// import { PrismaModule } from '../prisma/prisma.module';

// @Module({
//   imports: [
//     PrismaModule,
//     JwtModule.register({
//       global: true, // tùy chọn: để dùng JwtService ở nơi khác không cần import lại
//       secret: process.env.JWT_SECRET || 'dev-secret',
//       signOptions: { expiresIn: '7d' },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService],
//   exports: [AuthService],
// })
// export class AuthModule {}


// src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "dev_secret",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
})
export class AuthModule {}
