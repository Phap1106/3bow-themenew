

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.enableCors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
});


  // ✅ ép kiểu & lọc field thừa
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidUnknownValues: false,
  }));

  await app.listen(4000);
}
bootstrap();

  // origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

