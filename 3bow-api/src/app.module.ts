// import { Module } from "@nestjs/common";
// import { ConfigModule } from "@nestjs/config";
// import { PrismaModule } from "./prisma/prisma.module";
// import { ArticlesModule } from "./articles/articles.module";
// import { AppController } from "./app.controller";
// import { AuthModule } from "./auth/auth.module";
// import { UsersModule } from "./users/users.module";
// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     PrismaModule,
//     ArticlesModule,
//     AuthModule,      
//       UsersModule,
//   ],
//     controllers: [AppController],
// })
// export class AppModule {}


import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ArticlesModule } from "./articles/articles.module";

@Module({
imports: [PrismaModule, AuthModule, UsersModule, ArticlesModule]

})
export class AppModule {}
