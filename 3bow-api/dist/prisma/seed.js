"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    var _a, _b;
    const email = (_a = process.env.SEED_ADMIN_EMAIL) !== null && _a !== void 0 ? _a : "admin@3bow.local";
    const pass = (_b = process.env.SEED_ADMIN_PASS) !== null && _b !== void 0 ? _b : "admin123";
    const exists = await prisma.user.findUnique({ where: { email } });
    if (!exists) {
        const hash = await bcrypt.hash(pass, 10);
        await prisma.user.create({
            data: {
                email,
                password: hash,
                role: client_1.UserRole.ADMIN,
                firstName: "Admin",
                lastName: "Root",
            },
        });
        console.log("Seeded admin:", email, pass);
    }
    else {
        console.log("Admin already exists:", email);
    }
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=seed.js.map