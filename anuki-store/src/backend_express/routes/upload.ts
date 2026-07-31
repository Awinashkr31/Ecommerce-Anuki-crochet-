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

// Allowed MIME types — block SVG (XSS vector) and non-image types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Allowed upload folders — prevents path traversal (e.g. ../../etc/passwd)
const ALLOWED_FOLDERS = ['products', 'categories', 'banners', 'misc', 'avatars'];

// Configure Multer (store in memory for processing)
// Limit file size to 5MB for faster uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF image files are allowed.'));
    }
  }
});



router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), upload.single('image'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Magic-byte validation: use sharp to verify the buffer is actually an image
    try {
      const metadata = await sharp(req.file.buffer).metadata();
      if (!metadata.format || !['jpeg', 'png', 'webp', 'gif', 'tiff'].includes(metadata.format)) {
        return res.status(400).json({ error: 'Invalid image file. The file content does not match a supported image format.' });
      }
    } catch (sharpError) {
      return res.status(400).json({ error: 'Invalid image file. Could not process the uploaded file.' });
    }

    // Sanitize folder path — only allow known folder names
    const rawFolder = (req.body.folder || 'misc').replace(/[^a-zA-Z0-9_-]/g, '');
    const folder = ALLOWED_FOLDERS.includes(rawFolder) ? rawFolder : 'misc';

    const baseFileName = `${uuidv4()}`;

    // Convert to WebP, optimize, and strip EXIF/metadata with .rotate()
    const webpBuffer = await sharp(req.file.buffer)
      .rotate() // auto-orient and strip EXIF metadata
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 75, effort: 4 })
      .toBuffer();

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
    return res.status(500).json({ error: 'Failed to upload and process image. Please try again.' });
  }
});

export default router;
