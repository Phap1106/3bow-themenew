// prisma/seed.ts
import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@3bow.local";
  const pass  = process.env.SEED_ADMIN_PASS  ?? "admin123";

  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    const hash = await bcrypt.hash(pass, 10);
    await prisma.user.create({
      data: {
        email,
        password: hash,
        role: UserRole.ADMIN,   // ✅ dùng enum, không dùng số
        firstName: "Admin",
        lastName:  "Root",
      },
    });
    console.log("Seeded admin:", email, pass);
  } else {
    console.log("Admin already exists:", email);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
