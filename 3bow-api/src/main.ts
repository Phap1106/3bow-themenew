// //main.ts

// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";
// import { ValidationPipe } from "@nestjs/common";
// import * as cookieParser from 'cookie-parser';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.use(cookieParser());
//   app.setGlobalPrefix("api");
//   await app.listen(Number(process.env.PORT) || 4000, '0.0.0.0'); 
//   app.enableCors({
//   // origin: ['http://localhost:3000'],
//     origin: ['https://3bowdigital.com', 'https://www.3bowdigital.com'],
//   credentials: true,
//   methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization'],
// });


//   // ✅ ép kiểu & lọc field thừa
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     transform: true,
//     transformOptions: { enableImplicitConversion: true },
//     forbidUnknownValues: false,
//   }));

//   await app.listen(4000);
// }
// bootstrap();



import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix("api");

  app.enableCors({
    origin: [
      "https://3bowdigital.com",
      "https://www.3bowdigital.com",
      // nếu FE .site thì thêm:
      "https://3bowdigital.site",
      "https://www.3bowdigital.site",
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
    })
  );

  // CHỈ listen 1 lần, và listen trên 0.0.0.0
  await app.listen(Number(process.env.PORT) || 4000, "0.0.0.0");
}
bootstrap();
