// src/app.controller.ts
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  health() {
    return { ok: true, service: "3bow-api", version: "1.0.0" };
  }
}
