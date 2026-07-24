import { Router } from 'express';
import multer from 'multer';
import { verifyToken, requireRoles } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';

// Configure Multer (store in memory for processing)
// Limit file size to 10MB
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const IMAGE_SIZES = {
  thumbnail: 150,
  card: 400,
  detail: 800,
  full: 1200
};

router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), upload.single('image'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const baseFileName = `${uuidv4()}`;
    const uploadedUrls: Record<string, string> = {};

    // Process and upload each size in parallel
    const uploadPromises = Object.entries(IMAGE_SIZES).map(async ([sizeName, width]) => {
      // Convert to WebP and resize
      const webpBuffer = await sharp(req.file.buffer)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      const fileName = `${baseFileName}-${sizeName}.webp`;
      
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, webpBuffer, {
          contentType: 'image/webp',
          upsert: false // Don't overwrite since we use uuids
        });

      if (error) {
        console.error(`Failed to upload ${sizeName}:`, error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      uploadedUrls[sizeName] = publicUrl;
    });

    await Promise.all(uploadPromises);

    // Return all sizes to the frontend
    // The main URL used for default rendering will be the 'detail' size
    return res.json({ 
      url: uploadedUrls.detail, // Backwards compatibility for single URL expectations
      sizes: uploadedUrls       // Full multi-size structure
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to upload and process image' });
  }
});

export default router;
