import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadPhotos, getPhotos, updatePhoto, deletePhoto } from '../controllers/photoController.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'event-photos');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safe);
  }
});

const upload = multer({
  storage,
  limits: { files: 100, fileSize: 50 * 1024 * 1024 }, // up to 100 files, 50MB each
});

// POST /api/admin/photos - upload multiple photos for an event
router.post('/admin/photos', upload.array('photos', 100), uploadPhotos);

// GET /api/photos - list photos (optional eventId query)
router.get('/photos', getPhotos);

// PUT /api/photos/:id - update photo metadata
router.put('/photos/:id', updatePhoto);

// DELETE /api/photos/:id - delete photo by id
router.delete('/photos/:id', deletePhoto);

export default router;
