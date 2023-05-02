import { config } from 'dotenv';
config();
import { diskStorage } from 'multer';
import { extname } from 'path';

export default {
  development: {
    base_url: process.env.API_BASE_URL,
    version: process.env.API_VERSION,
  },
  production: {
    base_url: process.env.API_BASE_URL,
    version: process.env.API_VERSION,
  }
};

export const multerConfig = {
  limits: {
    fileSize: 4 * 1024 * 1024 * 1024, // 4GB limit
  },
};