"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
//đây là đoạn code để kết nối với cơ sở dữ liệu sử dụng Prisma Client.
const client_1 = require("@prisma/client");
require("dotenv/config");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query', 'info', 'warn', 'error'],
});
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
//# sourceMappingURL=client.js.map