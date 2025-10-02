import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsImageSizeValid(maxSizeMB: number = 5, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isImageSizeValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxSizeMB],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'string') {
            return true; // Để @IsOptional xử lý
          }

          // Kiểm tra nếu là base64 image
          const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,(.+)$/i;
          const match = value.match(base64Pattern);
          
          if (!match) {
            // Nếu không phải base64, có thể là URL - cho phép
            return true;
          }

          try {
            const base64Data = match[2];
            const sizeInBytes = (base64Data.length * 3) / 4;
            const sizeInMB = sizeInBytes / (1024 * 1024);
            const maxSize = args.constraints[0];
            
            return sizeInMB <= maxSize;
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const maxSize = args.constraints[0];
          return `Kích thước ảnh không được vượt quá ${maxSize}MB`;
        },
      },
    });
  };
}

export function IsValidImageFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidImageFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value || typeof value !== 'string') {
            return true; // Để @IsOptional xử lý
          }

          // Kiểm tra URL hợp lệ
          try {
            new URL(value);
            return true;
          } catch {
            // Không phải URL, kiểm tra base64
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
