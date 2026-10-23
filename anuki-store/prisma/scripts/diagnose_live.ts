async function check(url: string) {
  const r = await fetch(url);
  console.log('=== URL:', url, '===');
  console.log('STATUS:', r.status);
  console.log('DATE:', r.headers.get('date'));
  console.log('AGE:', r.headers.get('age'));
  console.log('X-VERCEL-CACHE:', r.headers.get('x-vercel-cache'));
  console.log('CACHE-CONTROL:', r.headers.get('cache-control'));
  console.log('ETAG:', r.headers.get('etag'));

  const text = await r.text();
  const title = text.match(/<title>[\s\S]*?<\/title>/i);
  const desc = text.match(/<meta[^>]*name=["']description["'][^>]*>/i);
  console.log('TITLE:', title ? title[0] : 'not found');
  console.log('DESC:', desc ? desc[0] : 'not found');
  
  // Search for address in text
  if (text.includes('Maurya Vihar')) {
    console.log('FOUND NEW ADDRESS: Maurya Vihar Colony, Kumhrar, Patna');
  } else if (text.includes('Ashok Rajpath')) {
    console.log('FOUND OLD ADDRESS: Ashok Rajpath Rd, near Gandhi Maidan, Lalbagh, Patna, Bihar 800001');
  } else {
    console.log('NEITHER ADDRESS FOUND DIRECTLY');
  }

  // Check LocalBusiness schema
  const schemaMatches = text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (schemaMatches) {
    for (const sm of schemaMatches) {
      if (sm.includes('LocalBusiness') || sm.includes('PostalAddress')) {
        console.log('SCHEMA FOUND:', sm);
      }
    }
  }
}

async function main() {
  await check('https://www.anukicrochet.in/products/handmade-crochet-sunflower-pot');
}

main().catch(console.error);
