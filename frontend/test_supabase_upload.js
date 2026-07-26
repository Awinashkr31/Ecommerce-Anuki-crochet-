const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';
  console.log(`Uploading to bucket: ${BUCKET_NAME}`);
  
  // Dummy text file to test upload
  const fileContent = "This is a test file to verify Supabase storage works!";
  const buffer = Buffer.from(fileContent, 'utf-8');
  
  const fileName = `test-upload-${Date.now()}.txt`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: 'text/plain',
      upsert: false
    });
    
  if (error) {
    console.error("Upload failed!", error.message);
  } else {
    console.log("Upload successful!", data);
    
    // Test get public URL
    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
      
    console.log("Public URL:", publicData.publicUrl);
  }
}

testUpload();
