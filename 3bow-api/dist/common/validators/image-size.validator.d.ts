import { ValidationOptions } from 'class-validator';
export declare function IsImageSizeValid(maxSizeMB?: number, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsValidImageFormat(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
