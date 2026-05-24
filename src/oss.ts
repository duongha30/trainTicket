//object storage server
import * as multer from 'multer';
import * as fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync('upload-files');
        } catch (error) {
            console.log('error in upload avatar', error);
        }
        cb(null, 'upload-files');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            '-' +
            file.originalname;
        cb(null, uniqueSuffix);
    },
});

export { storage };
