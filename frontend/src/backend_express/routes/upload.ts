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
// Limit file size to 5MB for faster uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});



router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), upload.single('image'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const baseFileName = `${uuidv4()}`;

    // Convert to WebP and highly optimize (max width 1000px)
    const webpBuffer = await sharp(req.file.buffer)
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 75, effort: 4 })
      .toBuffer();

    const folder = req.body.folder || 'misc';
    const fileName = `${folder}/${baseFileName}.webp`;
    
    // Upload to Supabase only (no local fallback)
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, webpBuffer, {
        contentType: 'image/webp',
        upsert: false 
      });

    if (error) {
      console.error(`Supabase upload failed:`, error.message);
      throw new Error(`Failed to upload to cloud storage: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const finalUrl = publicUrl;

    // Return the same URL for all sizes to prevent breaking existing frontend code
    return res.json({ 
      url: finalUrl, 
      sizes: {
        thumbnail: finalUrl,
        card: finalUrl,
        detail: finalUrl,
        full: finalUrl
      }
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to upload and process image' });
  }
});

export default router;
