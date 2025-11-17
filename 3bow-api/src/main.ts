// src/main.ts
import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; // ✅ default import
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Prefix cho API: http://domain/api/...
  const GLOBAL_PREFIX = 'api';
  app.setGlobalPrefix(GLOBAL_PREFIX);

  // Middleware xử lý Cookie
  app.use(cookieParser());

  // Tăng giới hạn upload body (5MB)
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
  app.use(express.raw({ limit: '5mb' }));

  // === CẤU HÌNH CORS CHUẨN (QUAN TRỌNG) ===
  app.enableCors({
    origin: [
      'https://3bowdigital.com',
      'https://www.3bowdigital.com',
      'https://3bowdigital.site',
      'https://www.3bowdigital.site',
      'http://localhost:3000', // Dev local
      'http://localhost:3001',
    ],
    credentials: true, // Cho phép Cookie/Session đi qua
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    // Mở rộng headers để tránh bị chặn bởi một số trình duyệt khó tính
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept', 
      'Origin', 
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
  });

  // Validation Pipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false, // Fix lỗi validation trên một số payload lạ
    }),
  );

  // Port ưu tiên lấy từ ENV, fallback về 4001
  const port = Number(process.env.PORT || 4001);
  
  await app.listen(port, '0.0.0.0');
  
  console.log(`\n✅ API ready on port ${port} (Prefix: /${GLOBAL_PREFIX})`);
  console.log(`✅ CORS Enabled for: https://3bowdigital.com`);
  
  // (Optional) In routes để debug - Có thể bỏ qua trong prod để log gọn hơn
  // printRoutes(app, GLOBAL_PREFIX); 
}
bootstrap();

function printRoutes(app: any, prefix = '') {
  const adapter = app.getHttpAdapter();
  const instance = adapter.getInstance();
  const routes: { method: string; path: string }[] = [];
  const add = (method: string, path: string) => {
    const p = `/${prefix}`.replace(/\/+$/, '') + (path.startsWith('/') ? path : `/${path}`);
    routes.push({ method, path: p });
  };
  if (instance?._router?.stack) {
    instance._router.stack.forEach((layer: any) => {
      if (layer.route?.path) {
        const methods = Object.keys(layer.route.methods)
          .filter((m) => layer.route.methods[m])
          .map((m) => m.toUpperCase())
          .join(',');
        add(methods, layer.route.path);
      } else if (layer.name === 'router' && layer.handle?.stack) {
        layer.handle.stack.forEach((h: any) => {
          if (h.route?.path) {
            const methods = Object.keys(h.route.methods)
              .filter((m) => h.route.methods[m])
              .map((m) => m.toUpperCase())
              .join(',');
            add(methods, h.route.path);
          }
        });
      }
    });
  }
  console.log('\n=== ROUTES (with global prefix) ===');
  console.table(routes);
}
