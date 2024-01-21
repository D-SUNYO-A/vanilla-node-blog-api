import * as path from 'path';
import multer from 'multer';

export const uploadMiddleware = new class {
    storage = multer.diskStorage({
        destination: (req, file, cd) => {
            cd(null, 'uploads/')
        },
        filename: (req, file, cd) => {
            let ext = path.extname(file.originalname)
            cd(null, Date.now() + ext)
        }
    });
    
    upload = multer({
        storage: this.storage,
        fileFilter: (req, file, callback) => {
            if (
                file.mimetype.startsWith('image/') || 
                file.mimetype.startsWith('video/')
            ) {
                callback(null, true);
            } else {
                console.log('Only image files are supported');
                callback(null, false);
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 100  // Limite de taille correcte
        }
    }).fields([{ name: 'images' }, { name: 'videos' }]);  
    // Utilisez fields pour gérer plusieurs champs
}
