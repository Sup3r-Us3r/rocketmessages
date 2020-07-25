import multer, { Options } from 'multer';
import { Request } from 'express';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

export default {
  fileFilter: (req: Request, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/pjpeg',
      'image/png',
    ];
    
    console.log('oiiiiiiii');

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type.'));
    }

    return cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (req: Request, file, cb) => {
      const filename = `${randomBytes(6).toString('hex')}-${file.originalname}`;

      return cb(null, filename);
    }
  })
} as Options;
