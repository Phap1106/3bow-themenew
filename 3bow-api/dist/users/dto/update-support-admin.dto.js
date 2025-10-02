"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSupportAdminDto = void 0;
const class_validator_1 = require("class-validator");
const image_size_validator_1 = require("../../common/validators/image-size.validator");
class UpdateSupportAdminDto {
}
exports.UpdateSupportAdminDto = UpdateSupportAdminDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSupportAdminDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSupportAdminDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSupportAdminDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSupportAdminDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, image_size_validator_1.IsValidImageFormat)({ message: 'Ảnh phải là URL hợp lệ hoặc base64 image (jpeg, jpg, png, gif, webp)' }),
    (0, image_size_validator_1.IsImageSizeValid)(2, { message: 'Kích thước ảnh không được vượt quá 2MB' }),
    __metadata("design:type", String)
], UpdateSupportAdminDto.prototype, "img", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Mật khẩu tối thiểu 6 ký tự' }),
    __metadata("design:type", String)
], UpdateSupportAdminDto.prototype, "password", void 0);
//# sourceMappingURL=update-support-admin.dto.js.map