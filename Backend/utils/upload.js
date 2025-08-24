import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadsRoot = path.join(process.cwd(), 'uploads');
const roomsDir = path.join(uploadsRoot, 'rooms');

// Ensure upload directories exist
if (!fs.existsSync(roomsDir)) {
  fs.mkdirSync(roomsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, roomsDir);
  },
  filename: function (_req, file, cb) {
    const timestamp = Date.now();
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${timestamp}-${sanitizedOriginal}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPG, PNG, WEBP images are allowed'));
};

export const uploadRoomImage = multer({ storage, fileFilter }).single('image');



