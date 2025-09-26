import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; // ✅ default import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const GLOBAL_PREFIX = 'api';
  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.use(cookieParser()); // ✅ callable

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://3bowdigital.com',
      'https://www.3bowdigital.com',
      'https://3bowdigital.site',
      'https://www.3bowdigital.site',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
    }),
  );

  await app.init();
  printRoutes(app, GLOBAL_PREFIX);

  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
  console.log(`\n✅ API ready on http://localhost:${port} (prefix: /${GLOBAL_PREFIX})`);
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
