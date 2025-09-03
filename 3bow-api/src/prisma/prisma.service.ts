import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  // ✅ Prisma 5: KHÔNG dùng this.$on('beforeExit')
  async enableShutdownHooks(app: INestApplication) {
    const shutdown = async () => {
      await app.close();
      // optional: await this.$disconnect();
    };
    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
    process.once("beforeExit", shutdown);
  }

    constructor() {
    super({ log: ["query", "error", "warn"] }); // thấy lỗi chi tiết trong console
  }
}



