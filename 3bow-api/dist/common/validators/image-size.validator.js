"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsImageSizeValid = IsImageSizeValid;
exports.IsValidImageFormat = IsValidImageFormat;
const class_validator_1 = require("class-validator");
function IsImageSizeValid(maxSizeMB = 5, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isImageSizeValid',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [maxSizeMB],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    if (!value || typeof value !== 'string') {
                        return true;
                    }
                    const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,(.+)$/i;
                    const match = value.match(base64Pattern);
                    if (!match) {
                        return true;
                    }
                    try {
                        const base64Data = match[2];
                        const sizeInBytes = (base64Data.length * 3) / 4;
                        const sizeInMB = sizeInBytes / (1024 * 1024);
                        const maxSize = args.constraints[0];
                        return sizeInMB <= maxSize;
                    }
                    catch (error) {
                        return false;
                    }
                },
                defaultMessage(args) {
                    const maxSize = args.constraints[0];
                    return `Kích thước ảnh không được vượt quá ${maxSize}MB`;
                },
            },
        });
    };
}
function IsValidImageFormat(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidImageFormat',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (!value || typeof value !== 'string') {
                        return true;
                    }
                    try {
                        new URL(value);
                        return true;
                    }
                    catch {
                        const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,([A-Za-z0-9+/=]+)$/i;
                        return base64Pattern.test(value);
                    }
                },
                defaultMessage() {
                    return 'Ảnh phải là URL hợp lệ hoặc base64 image (jpeg, jpg, png, gif, webp)';
                },
            },
        });
    };
}
//# sourceMappingURL=image-size.validator.js.map