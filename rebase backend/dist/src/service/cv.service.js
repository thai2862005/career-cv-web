"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultCV = exports.deleteCV = exports.updateCV = exports.getCVById = exports.getUserCVs = exports.createCV = void 0;
const client_1 = require("../config/client");
// Create CV
const createCV = (userId, data, file) => __awaiter(void 0, void 0, void 0, function* () {
    // If setting as default, unset other defaults
    if (data.isDefault) {
        yield client_1.prisma.cV.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }
    const cv = yield client_1.prisma.cV.create({
        data: {
            userId,
            title: data.title,
            filename: file.filename,
            fileUrl: file.path,
            fileSize: file.size,
            isDefault: data.isDefault,
        },
    });
    return cv;
});
exports.createCV = createCV;
// Get all CVs of a user
const getUserCVs = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cvs = yield client_1.prisma.cV.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
    return cvs;
});
exports.getUserCVs = getUserCVs;
// Get CV by ID
const getCVById = (cvId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cv = yield client_1.prisma.cV.findFirst({
        where: { id: cvId, userId },
    });
    if (!cv) {
        throw new Error('Không tìm thấy CV');
    }
    return cv;
});
exports.getCVById = getCVById;
// Update CV
const updateCV = (cvId, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const cv = yield client_1.prisma.cV.findFirst({
        where: { id: cvId, userId },
    });
    if (!cv) {
        throw new Error('Không tìm thấy CV');
    }
    // If setting as default, unset other defaults
    if (data.isDefault) {
        yield client_1.prisma.cV.updateMany({
            where: { userId, isDefault: true, id: { not: cvId } },
            data: { isDefault: false },
        });
    }
    const updatedCV = yield client_1.prisma.cV.update({
        where: { id: cvId },
        data,
    });
    return updatedCV;
});
exports.updateCV = updateCV;
// Delete CV
const deleteCV = (cvId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cv = yield client_1.prisma.cV.findFirst({
        where: { id: cvId, userId },
    });
    if (!cv) {
        throw new Error('Không tìm thấy CV');
    }
    // Check if CV is used in any application
    const applications = yield client_1.prisma.jobApplication.findFirst({
        where: { cvId },
    });
    if (applications) {
        throw new Error('Không thể xóa CV đang được sử dụng trong đơn ứng tuyển');
    }
    yield client_1.prisma.cV.delete({
        where: { id: cvId },
    });
    return { message: 'Xóa CV thành công' };
});
exports.deleteCV = deleteCV;
// Set default CV
const setDefaultCV = (cvId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cv = yield client_1.prisma.cV.findFirst({
        where: { id: cvId, userId },
    });
    if (!cv) {
        throw new Error('Không tìm thấy CV');
    }
    // Unset other defaults
    yield client_1.prisma.cV.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
    });
    // Set this as default
    const updatedCV = yield client_1.prisma.cV.update({
        where: { id: cvId },
        data: { isDefault: true },
    });
    return updatedCV;
});
exports.setDefaultCV = setDefaultCV;
//# sourceMappingURL=cv.service.js.map