import multer from 'multer';
import { v4 } from 'uuid';
import { extname, resolve } from 'node:path';

const storage = multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) => {
        callback(null, `${v4()}${extname(file.originalname)}`);
    }
});

// Configuração do multer com limites e filtros
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // Limite de 2MB
    },
    fileFilter: (request, file, callback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Formato de arquivo não aceito.'));
        }
    }
});

export default upload;