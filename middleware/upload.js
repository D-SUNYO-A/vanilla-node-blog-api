import * as path from 'path';
import multer from 'multer';

export const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'uploads/')
    },
    filename: (req, file, cd) => {
        let ext = path.extname(file.originalname)
        cd(null, Date.now() + ext)
    }
});

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) { // Prends tut les types d'images possible
            callback(null, true);
        } else {
            console.log('Only image files are supported');
            callback(null, false);
        }
    },
    limits: {
        fileSize: 10024 * 10024 * 2  // Limite de taille correcte
    }
}).array('images');  // Utilisez array pour gérer les fichiers multiples
