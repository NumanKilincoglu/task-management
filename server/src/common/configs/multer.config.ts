import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

//Burada file yukleme islemi varsa multer import ettim
//file ismi uretiyor dosya icin. Upload klasorunu de aciyor
export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
};
