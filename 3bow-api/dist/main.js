"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const GLOBAL_PREFIX = 'api';
    app.setGlobalPrefix(GLOBAL_PREFIX);
    app.use((0, cookie_parser_1.default)());
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidUnknownValues: false,
    }));
    await app.init();
    printRoutes(app, GLOBAL_PREFIX);
    const port = Number(process.env.PORT || 4000);
    await app.listen(port, '0.0.0.0');
    console.log(`\n✅ API ready on http://localhost:${port} (prefix: /${GLOBAL_PREFIX})`);
}
bootstrap();
function printRoutes(app, prefix = '') {
    const adapter = app.getHttpAdapter();
    const instance = adapter.getInstance();
    const routes = [];
    const add = (method, path) => {
        const p = `/${prefix}`.replace(/\/+$/, '') + (path.startsWith('/') ? path : `/${path}`);
        routes.push({ method, path: p });
    };
    if (instance?._router?.stack) {
        instance._router.stack.forEach((layer) => {
            if (layer.route?.path) {
                const methods = Object.keys(layer.route.methods)
                    .filter((m) => layer.route.methods[m])
                    .map((m) => m.toUpperCase())
                    .join(',');
                add(methods, layer.route.path);
            }
            else if (layer.name === 'router' && layer.handle?.stack) {
                layer.handle.stack.forEach((h) => {
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
//# sourceMappingURL=main.js.map