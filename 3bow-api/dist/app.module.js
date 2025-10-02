"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const leads_module_1 = require("./leads/leads.module");
const users_module_1 = require("./users/users.module");
const articles_module_1 = require("./articles/articles.module");
const auth_module_1 = require("./auth/auth.module");
const notes_module_1 = require("./notes/notes.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (cfg) => ({
                    type: 'mysql',
                    host: cfg.get('DB_HOST', '127.0.0.1'),
                    port: Number(cfg.get('DB_PORT', '3306')),
                    username: cfg.get('DB_USER', 'root'),
                    password: cfg.get('DB_PASS', ''),
                    database: cfg.get('DB_NAME', 'threebow'),
                    autoLoadEntities: true,
                    synchronize: false,
                    charset: 'utf8mb4_unicode_ci',
                }),
            }),
            leads_module_1.LeadsModule,
            users_module_1.UsersModule,
            articles_module_1.ArticlesModule,
            auth_module_1.AuthModule,
            notes_module_1.NotesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map