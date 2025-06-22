import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    //Max 5MB dosya boyutu
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File is too large!');
    }

    const relativePath = path.join('uploads', file.filename);

    return {
      message: 'File uploaded successfully',
      relativePath: relativePath,
      fileType: file.mimetype,
      fileName: file.filename,
    };
  }
}
