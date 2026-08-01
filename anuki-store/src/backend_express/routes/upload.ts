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
// Limit file size to 2MB for customer uploads, 5MB for admin uploads
const storage = multer.memoryStorage();
const uploadAdmin = multer({ 
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

const uploadCustomer = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 2 }, // 2MB max, max 2 files
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF image files are allowed.'));
    }
  }
});

router.post('/', verifyToken, requireRoles(['ADMIN', 'SUPER_ADMIN', 'CATALOG_MANAGER']), uploadAdmin.single('image'), async (req: any, res: any) => {
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

// Customer upload route (for reviews)
router.post('/customer', verifyToken, uploadCustomer.array('images', 2), async (req: any, res: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const uploadedUrls: string[] = [];

    for (const file of req.files) {
      // Magic-byte validation
      const metadata = await sharp(file.buffer).metadata();
      if (!metadata.format || !['jpeg', 'png', 'webp', 'gif', 'tiff'].includes(metadata.format)) {
        return res.status(400).json({ error: 'Invalid image file.' });
      }

      // Convert to webp
      const optimizedBuffer = await sharp(file.buffer)
        .webp({ quality: 80, effort: 4 })
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .toBuffer();

      const fileName = `${uuidv4()}.webp`;
      const filePath = `reviews/${fileName}`;

      const { data, error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(filePath, optimizedBuffer, {
          contentType: 'image/webp',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return res.status(500).json({ error: 'Failed to upload image to storage provider.' });
      }

      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      uploadedUrls.push(publicUrl);
    }

    res.status(200).json({ urls: uploadedUrls });
  } catch (error: any) {
    console.error('Customer image upload error:', error);
    res.status(500).json({ error: 'Internal server error during upload.' });
  }
});

export default router;
