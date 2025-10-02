"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const promise_1 = require("mysql2/promise");
const notes_controller_1 = require("./notes.controller");
const notes_service_1 = require("./notes.service");
let NotesModule = class NotesModule {
};
exports.NotesModule = NotesModule;
exports.NotesModule = NotesModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [notes_controller_1.NotesController],
        providers: [
            notes_service_1.NotesService,
            {
                provide: 'DB_POOL',
                inject: [config_1.ConfigService],
                useFactory: async (cfg) => {
                    return (0, promise_1.createPool)({
                        host: cfg.get('DB_HOST', '127.0.0.1'),
                        port: Number(cfg.get('DB_PORT', '3306')),
                        user: cfg.get('DB_USER', 'root'),
                        password: cfg.get('DB_PASS', ''),
                        database: cfg.get('DB_NAME', 'threebow'),
                        connectionLimit: 10,
                        charset: 'utf8mb4_unicode_ci',
                    });
                },
            },
        ],
    })
], NotesModule);
//# sourceMappingURL=notes.module.js.map