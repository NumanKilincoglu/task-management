import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',                                           
      'application/msword',                                                 
      'video/mp4',
      'video/quicktime', 
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    //Max 5MB dosya boyutu
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File is too large!');
    }

    const relativePath = path.join('uploads', file.filename);

    return {
      file_path: relativePath,
      attachment_type: file.mimetype,
      file_name: file.filename,
    };
  }
}
