/**
 * Gift Page Configuration
 *
 * Central data source for all /gifts/[slug] landing pages.
 * Each entry drives: metadata, hero, product query, SEO article, and cross-links.
 *
 * Product filter types:
 *  - 'category'  → filter by category slugs
 *  - 'price'     → filter by price range (maxPrice / minPrice)
 *  - 'all'       → show all published products
 */

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type GiftPageProductFilter =
  | { type: 'category'; slugs: string[]; extraCategorySlugs?: string[] }
  | { type: 'price'; maxPrice?: number; minPrice?: number }
  | { type: 'combo'; maxPrice?: number; minPrice?: number; slugs: string[] }
  | { type: 'all' };

export interface SeoArticleSection {
  heading: string;          // h2 or h3
  level: 'h2' | 'h3';
  /** Paragraphs of plain text (rendered as <p> tags) */
  paragraphs?: string[];
  /** Bullet points — each can include simple HTML (links rendered with next/link) */
  bullets?: { text: string; href?: string }[];
}

export interface GiftPageConfig {
  slug: string;
  /** Page <title> — appended with " | Anuki Crochet" via template */
  title: string;
  /** Meta description (120-160 chars) */
  description: string;
  /** Open Graph description (can be shorter) */
  ogDescription: string;

  /** Hero section */
  hero: {
    badge: string;       // e.g. "🎂 For Their Special Day"
    heading: string;     // h1
    subheading: string;  // paragraph under h1
  };

  /** How to query products */
  productFilter: GiftPageProductFilter;
  /** Sort order */
  orderBy: 'price_asc' | 'price_desc';

  /** Breadcrumb label shown after "Gifts >" */
  breadcrumbLabel: string;
  /** sr-only h2 for product grid */
  gridLabel: string;
  /** JSON-LD ItemList name */
  itemListName: string;

  /** SEO content article below products */
  seoArticle: SeoArticleSection[];

  /** Related gift page slugs for cross-linking */
  relatedSlugs: string[];
}

// ──────────────────────────────────────────────
// Page Definitions
// ──────────────────────────────────────────────

export const GIFT_PAGES: GiftPageConfig[] = [
  // ═══════════════════════════════════════════
  // EXISTING OCCASION PAGES (preserved content)
  // ═══════════════════════════════════════════

  {
    slug: 'birthday',
    title: 'Handmade Birthday Gifts | Unique Crochet Birthday Gift Ideas India',
    description: 'Find the perfect handmade birthday gift! Cute crochet plushies, keychains, flower bouquets, and hair accessories. Unique birthday gifts for her delivered across India.',
    ogDescription: 'Find the perfect handmade birthday gift! Cute crochet plushies, keychains, and flower bouquets.',
    hero: {
      badge: '🎂 For Their Special Day',
      heading: 'Handmade Birthday Gifts',
      subheading: 'Make their birthday unforgettable with a one-of-a-kind handmade crochet gift. From cuddly amigurumi toys to flower bouquets that last forever — each piece is crafted with love.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Birthday Gifts',
    gridLabel: 'Birthday gift ideas',
    itemListName: 'Handmade Birthday Gifts',
    seoArticle: [
      {
        heading: 'Why Choose Handmade Birthday Gifts?',
        level: 'h2',
        paragraphs: [
          'A handmade gift carries a personal touch that no store-bought item can match. When you gift a crochet plush toy, keychain, or bouquet, you\'re giving something that was made with hours of care and creativity. It shows the birthday person that you put real thought into their gift.',
        ],
      },
      {
        heading: 'Birthday Gift Ideas by Budget',
        level: 'h3',
        bullets: [
          { text: 'Under ₹300 — Cute keychains, hair clips, and mini bouquets', href: '/gifts/under-300' },
          { text: 'Under ₹500 — Flower pots, premium keychains, and hair accessories', href: '/gifts/under-500' },
          { text: 'Under ₹1000 — Amigurumi plush toys and strawberry pillows', href: '/gifts/under-1000' },
        ],
      },
      {
        heading: 'Birthday Gift Ideas by Type',
        level: 'h3',
        bullets: [
          { text: 'For Her: Crochet hair accessories, flower bouquets', href: '/categories/hair-accessories' },
          { text: 'For Friends: Cute keychains, small plushies', href: '/categories/keychains' },
          { text: 'For Kids: Amigurumi plush toys — Pikachu, Bunny, and more', href: '/categories/toys' },
        ],
      },
      {
        heading: '',
        level: 'h3',
        paragraphs: [
          'Want something truly unique? Order a custom crochet gift made just for them!',
        ],
        bullets: [
          { text: 'Design a custom crochet gift →', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['for-girlfriend', 'for-best-friend', 'under-500', 'anniversary'],
  },

  {
    slug: 'anniversary',
    title: 'Handmade Anniversary Gifts | Crochet Gifts for Couples India',
    description: 'Celebrate your love with unique handmade anniversary gifts. Crochet flower bouquets, flower pots, and custom gifts that last forever. Delivered across India.',
    ogDescription: 'Celebrate your love with unique handmade crochet anniversary gifts that last forever.',
    hero: {
      badge: '💕 Celebrate Your Love',
      heading: 'Handmade Anniversary Gifts',
      subheading: 'Mark your special milestone with a handcrafted gift that lasts as long as your love. Our crochet bouquets and flower arrangements never wilt — just like your bond.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'keychains'], extraCategorySlugs: ['toys'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Anniversary Gifts',
    gridLabel: 'Anniversary gift ideas',
    itemListName: 'Handmade Anniversary Gifts',
    seoArticle: [
      {
        heading: 'Why Crochet Anniversary Gifts Are Special',
        level: 'h2',
        paragraphs: [
          'An anniversary celebrates a love that endures — and what better way to honor that than with a gift that lasts forever? Unlike real flowers that wilt in days, our crochet flower bouquets stay vibrant and beautiful for a lifetime. They\'re a daily reminder of your love story.',
        ],
      },
      {
        heading: 'Anniversary Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'For Wife/Girlfriend: A romantic crochet tulip bouquet or a cute amigurumi plush toy', href: '/categories/flower-bouquets' },
          { text: 'For Husband/Boyfriend: A personalized crochet keychain he can carry every day', href: '/categories/keychains' },
          { text: 'For the Home: A beautiful crochet flower pot arrangement for the couple\'s living room', href: '/categories/flower-pots' },
        ],
      },
      {
        heading: '',
        level: 'h3',
        paragraphs: [
          'Looking for something truly one-of-a-kind? Design a custom crochet gift with their favorite colors, flowers, or characters.',
        ],
        bullets: [
          { text: 'Design a custom crochet gift →', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['for-wife', 'for-husband', 'for-couples', 'valentines-day'],
  },

  {
    slug: 'valentines-day',
    title: "Valentine's Day Gifts | Handmade Crochet Valentine Gifts India",
    description: "Shop handmade Valentine's Day gifts! Romantic crochet flower bouquets, heart keychains, cute plush toys, and personalized gifts for her. Delivered across India.",
    ogDescription: "Shop handmade Valentine's Day gifts! Romantic crochet flower bouquets and cute plush toys.",
    hero: {
      badge: '❤️ Say It With Crochet',
      heading: "Valentine's Day Gifts",
      subheading: "Skip the wilting roses! Gift a handmade crochet bouquet or a cute plush toy that'll last as long as your love. Each piece is hand-crocheted with care and delivered across India.",
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: "Valentine's Day Gifts",
    gridLabel: "Valentine's Day gift ideas",
    itemListName: "Valentine's Day Gifts",
    seoArticle: [
      {
        heading: "Why Crochet Gifts Make the Best Valentine's Day Presents",
        level: 'h2',
        paragraphs: [
          "Real flowers wilt within a week. A crochet bouquet? It stays beautiful forever — just like your love. Our handmade Valentine's gifts are crafted with premium yarn in romantic colors, making them the perfect way to show someone you care.",
        ],
      },
      {
        heading: 'Valentine Gift Ideas for Her',
        level: 'h3',
        bullets: [
          { text: 'Crochet Tulip Bouquets — Romantic forever flowers', href: '/categories/flower-bouquets' },
          { text: 'Heart Hair Clips — Wearable love tokens', href: '/categories/hair-accessories' },
          { text: "Cute Plush Toys — Cuddly companions she'll adore", href: '/categories/toys' },
        ],
      },
      {
        heading: 'Valentine Gift Ideas for Him',
        level: 'h3',
        bullets: [
          { text: 'Character Keychains — Fun, everyday carry reminders', href: '/categories/keychains' },
          { text: 'Custom Crochet — Design something with his favorite character or hobby', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['for-girlfriend', 'for-boyfriend', 'anniversary', 'for-couples'],
  },

  {
    slug: 'raksha-bandhan',
    title: 'Raksha Bandhan Gifts | Handmade Crochet Rakhi Gifts India',
    description: 'Shop unique Raksha Bandhan gifts for sisters and brothers! Handmade crochet keychains, hair clips, flower bouquets, and more. Affordable rakhi gifts under ₹500 delivered across India.',
    ogDescription: 'Shop unique Raksha Bandhan gifts! Handmade crochet keychains, hair clips, and flower bouquets.',
    hero: {
      badge: '🪢 For Your Sibling',
      heading: 'Raksha Bandhan Gifts',
      subheading: 'Celebrate the bond of love with a thoughtful handmade gift this Raksha Bandhan. From cute keychains for bhaiya to pretty hair clips for didi — find the perfect rakhi gift here.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'hair-accessories', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Raksha Bandhan Gifts',
    gridLabel: 'Raksha Bandhan gift ideas',
    itemListName: 'Raksha Bandhan Gifts',
    seoArticle: [
      {
        heading: 'Handmade Rakhi Gifts That Show You Care',
        level: 'h2',
        paragraphs: [
          "Skip the generic chocolates and mass-produced gifts this Raksha Bandhan. A handmade crochet gift tells your sibling they're truly special. Each piece is crafted with love, making it a keepsake they'll cherish long after the festival is over.",
        ],
      },
      {
        heading: 'Rakhi Gift Ideas for Sisters',
        level: 'h3',
        bullets: [
          { text: 'Crochet Hair Accessories — Daisy clips, heart clips, sunflower claw clips', href: '/categories/hair-accessories' },
          { text: 'Mini Flower Bouquets — A tiny forever bouquet for her desk', href: '/categories/flower-bouquets' },
        ],
      },
      {
        heading: 'Rakhi Gift Ideas for Brothers',
        level: 'h3',
        bullets: [
          { text: 'Fun Crochet Keychains — Teddy bear, dinosaur, Pikachu keychains', href: '/categories/keychains' },
          { text: 'Custom Crochet — Get a keychain of his favorite character', href: '/custom' },
        ],
      },
      {
        heading: 'Budget-Friendly Rakhi Gifts',
        level: 'h3',
        paragraphs: [
          'Most of our Raksha Bandhan gifts are under ₹300, making them perfect for gifting to multiple siblings without breaking the bank.',
        ],
        bullets: [
          { text: 'Browse gifts under ₹300 →', href: '/gifts/under-300' },
        ],
      },
    ],
    relatedSlugs: ['for-sister', 'for-brother', 'under-300', 'under-500'],
  },

  // ═══════════════════════════════════════════
  // EXISTING BUDGET PAGES (preserved content)
  // ═══════════════════════════════════════════

  {
    slug: 'under-300',
    title: 'Handmade Gifts Under ₹300 | Affordable Crochet Gifts India',
    description: 'Shop beautiful handmade crochet gifts under ₹300. Affordable keychains, hair clips, and cute accessories. Perfect budget-friendly gifts delivered across India.',
    ogDescription: 'Shop beautiful handmade crochet gifts under ₹300. Affordable keychains, hair clips, and cute accessories.',
    hero: {
      badge: 'Budget-Friendly Gifts',
      heading: 'Handmade Gifts Under ₹300',
      subheading: "Beautiful handcrafted crochet gifts that won't break the bank. Perfect for birthdays, small celebrations, or just because. Each piece is lovingly made by hand in India.",
    },
    productFilter: { type: 'price', maxPrice: 300 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹300',
    gridLabel: 'Products under ₹300',
    itemListName: 'Handmade Crochet Gifts Under ₹300',
    seoArticle: [
      {
        heading: 'Affordable Handmade Gifts That Feel Special',
        level: 'h2',
        paragraphs: [
          "Finding a meaningful gift on a budget doesn't have to be hard. Our collection of handmade crochet gifts under ₹300 includes adorable keychains, pretty hair clips, cute flower bouquets, and more. Each item is hand-crocheted with premium yarn by skilled artisans, making every piece one-of-a-kind.",
        ],
      },
      {
        heading: 'Perfect For',
        level: 'h3',
        bullets: [
          { text: 'Birthday gifts for friends and classmates' },
          { text: 'Return gifts and party favors' },
          { text: 'Raksha Bandhan gifts for siblings', href: '/gifts/raksha-bandhan' },
          { text: 'Small gestures that make a big impact' },
        ],
      },
    ],
    relatedSlugs: ['under-500', 'under-200', 'birthday', 'for-best-friend'],
  },

  {
    slug: 'under-500',
    title: 'Handmade Gifts Under ₹500 | Crochet Gift Ideas India',
    description: 'Discover handmade crochet gifts under ₹500. Beautiful keychains, plushies, hair accessories, and flower bouquets. Unique handcrafted gifts delivered across India.',
    ogDescription: 'Discover handmade crochet gifts under ₹500. Beautiful keychains, plushies, hair accessories, and flower bouquets.',
    hero: {
      badge: 'Best Sellers',
      heading: 'Handmade Gifts Under ₹500',
      subheading: 'Our most popular price range! From cute keychains to beautiful flower bouquets and stylish hair accessories — find the perfect handmade gift without spending a fortune.',
    },
    productFilter: { type: 'price', maxPrice: 500 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹500',
    gridLabel: 'Products under ₹500',
    itemListName: 'Handmade Crochet Gifts Under ₹500',
    seoArticle: [
      {
        heading: 'Why Handmade Gifts Under ₹500 Are the Best Choice',
        level: 'h2',
        paragraphs: [
          "In a world of mass-produced items, a handmade gift stands out. Our crochet gifts under ₹500 are crafted with care, each stitch telling a story. Whether it's a cute crochet keychain for your bestie or a delicate daisy hair clip for your sister, these gifts carry the warmth of something truly special.",
        ],
      },
      {
        heading: 'Popular Categories in This Range',
        level: 'h3',
        bullets: [
          { text: 'Crochet Keychains — Fun, portable, and utterly adorable', href: '/categories/keychains' },
          { text: 'Hair Accessories — Handmade clips, ties, and claw clips', href: '/categories/hair-accessories' },
          { text: 'Flower Bouquets — Flowers that never wilt', href: '/categories/flower-bouquets' },
          { text: 'Flower Pots — Desk décor that lasts forever', href: '/categories/flower-pots' },
        ],
      },
    ],
    relatedSlugs: ['under-300', 'under-1000', 'anniversary', 'for-girlfriend'],
  },

  {
    slug: 'under-1000',
    title: 'Handmade Gifts Under ₹1000 | Premium Crochet Gifts India',
    description: 'Shop premium handmade crochet gifts under ₹1000. Amigurumi plush toys, flower pots, strawberry pillows, and more. Unique handcrafted gifts delivered across India.',
    ogDescription: 'Shop premium handmade crochet gifts under ₹1000. Amigurumi plush toys, flower pots, and more.',
    hero: {
      badge: 'Premium Collection',
      heading: 'Handmade Gifts Under ₹1000',
      subheading: 'Our premium collection features larger crochet creations — adorable amigurumi plush toys, sunflower pot arrangements, and strawberry pillows. Perfect for meaningful milestones and celebrations.',
    },
    productFilter: { type: 'price', maxPrice: 1000 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹1000',
    gridLabel: 'Products under ₹1000',
    itemListName: 'Handmade Crochet Gifts Under ₹1000',
    seoArticle: [
      {
        heading: 'Premium Handmade Gifts That Leave a Lasting Impression',
        level: 'h2',
        paragraphs: [
          'When you want a gift that truly stands out, our premium crochet collection delivers. These larger pieces — from huggable bunny plushies to detailed sunflower pot arrangements — take hours of skilled craftsmanship to create. Each one is a unique work of art that your loved ones will treasure for years.',
        ],
      },
      {
        heading: 'Featured in This Collection',
        level: 'h3',
        bullets: [
          { text: 'Amigurumi Plush Toys — Bunny, Pikachu, Strawberry pillows', href: '/categories/toys' },
          { text: 'Crochet Flower Pots — Desk décor that lasts forever', href: '/categories/flower-pots' },
          { text: 'Premium Keychains — Detailed, larger keychain designs', href: '/categories/keychains' },
        ],
      },
    ],
    relatedSlugs: ['under-500', 'premium', 'anniversary', 'wedding'],
  },

  // ═══════════════════════════════════════════
  // NEW BUDGET PAGES
  // ═══════════════════════════════════════════

  {
    slug: 'under-200',
    title: 'Handmade Gifts Under ₹200 | Cheap Crochet Gifts Online India',
    description: 'Shop the most affordable handmade crochet gifts under ₹200. Cute mini keychains, hair clips, and small accessories. Perfect return gifts delivered across India.',
    ogDescription: 'Shop the most affordable handmade crochet gifts under ₹200. Cute mini keychains and hair clips.',
    hero: {
      badge: '💰 Most Affordable',
      heading: 'Handmade Gifts Under ₹200',
      subheading: 'Thoughtful doesn\'t have to mean expensive. Our most affordable crochet gifts start at just ₹99 — perfect for return gifts, party favors, and small gestures that brighten someone\'s day.',
    },
    productFilter: { type: 'price', maxPrice: 200 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹200',
    gridLabel: 'Products under ₹200',
    itemListName: 'Handmade Crochet Gifts Under ₹200',
    seoArticle: [
      {
        heading: 'Tiny Gifts, Big Smiles',
        level: 'h2',
        paragraphs: [
          'Our under ₹200 collection proves that the best gifts don\'t come with big price tags. These mini crochet creations — from tiny keychains to delicate hair clips — are handmade with the same love and quality as our premium pieces, just in a pocket-friendly size.',
        ],
      },
      {
        heading: 'Great For',
        level: 'h3',
        bullets: [
          { text: 'Birthday return gifts for classmates and friends' },
          { text: 'Party favors and goody bag fillers' },
          { text: 'Stocking stuffers and small surprises' },
          { text: 'Friendship Day gifts for your squad', href: '/gifts/friendship-day' },
          { text: 'Bulk orders for events', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['under-300', 'under-500', 'for-best-friend', 'friendship-day'],
  },

  {
    slug: 'premium',
    title: 'Premium Handmade Gifts | Luxury Crochet Gifts India',
    description: 'Discover our premium handmade crochet gift collection. Large amigurumi plush toys, luxury flower bouquets, and bespoke custom creations. Premium gifting delivered across India.',
    ogDescription: 'Discover our premium handmade crochet gifts. Large plush toys, luxury flower bouquets, and bespoke creations.',
    hero: {
      badge: '✨ Luxury Collection',
      heading: 'Premium Handmade Gifts',
      subheading: 'For occasions that deserve something extraordinary. Our premium collection features our largest, most detailed crochet creations — each one a masterpiece of handmade artistry.',
    },
    productFilter: { type: 'price', minPrice: 1000 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Premium Gifts',
    gridLabel: 'Premium handmade gifts',
    itemListName: 'Premium Handmade Crochet Gifts',
    seoArticle: [
      {
        heading: 'Why Choose Premium Handmade Gifts?',
        level: 'h2',
        paragraphs: [
          'Some moments deserve more than ordinary. Our premium crochet gifts are statement pieces — large bouquets with dozens of flowers, oversized plush toys, and custom-designed creations that take days of skilled craftsmanship. When you want to make an unforgettable impression, these are the gifts that do it.',
        ],
      },
      {
        heading: 'Premium Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Large Flower Bouquets — Stunning arrangements with 10+ flowers', href: '/categories/flower-bouquets' },
          { text: 'Oversized Plush Toys — Huggable amigurumi that become centerpieces', href: '/categories/toys' },
          { text: 'Custom Creations — Commission a bespoke design just for them', href: '/custom' },
        ],
      },
      {
        heading: 'Perfect Occasions for Premium Gifts',
        level: 'h3',
        bullets: [
          { text: 'Wedding gifts for the couple', href: '/gifts/wedding' },
          { text: 'Anniversary milestones', href: '/gifts/anniversary' },
          { text: 'Valentine\'s Day showstopper', href: '/gifts/valentines-day' },
          { text: 'Housewarming gifts', href: '/gifts/housewarming' },
        ],
      },
    ],
    relatedSlugs: ['under-1000', 'wedding', 'anniversary', 'for-wife'],
  },

  // ═══════════════════════════════════════════
  // NEW RECIPIENT PAGES
  // ═══════════════════════════════════════════

  {
    slug: 'for-girlfriend',
    title: 'Crochet Gifts for Girlfriend | Handmade Gift Ideas for Her India',
    description: 'Find the perfect handmade gift for your girlfriend! Crochet flower bouquets, cute plush toys, hair accessories, and personalized gifts. Delivered across India with love.',
    ogDescription: 'Find the perfect handmade gift for your girlfriend! Crochet bouquets, plush toys, and personalized gifts.',
    hero: {
      badge: '💝 Made With Love',
      heading: 'Gifts for Girlfriend',
      subheading: 'Show her you care with a handmade gift that\'s as unique as she is. From romantic forever flower bouquets to adorable plush toys — each piece is crafted with love, just for her.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'toys', 'hair-accessories', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Girlfriend',
    gridLabel: 'Gift ideas for girlfriend',
    itemListName: 'Crochet Gifts for Girlfriend',
    seoArticle: [
      {
        heading: 'Why Handmade Gifts Are Perfect for Your Girlfriend',
        level: 'h2',
        paragraphs: [
          'A handmade gift says what words sometimes can\'t — that you\'ve put real thought, time, and effort into choosing something special. Our crochet gifts for girlfriends range from romantic flower bouquets that never wilt to cute plush toys she can cuddle. Each piece is one-of-a-kind, just like your relationship.',
        ],
      },
      {
        heading: 'Top Gift Ideas for Girlfriend',
        level: 'h3',
        bullets: [
          { text: 'Crochet Tulip Bouquets — Romantic flowers that last forever', href: '/categories/flower-bouquets' },
          { text: 'Cute Plush Toys — Adorable bunny, bear, or custom character plushies', href: '/categories/toys' },
          { text: 'Hair Accessories — Handmade crochet clips she\'ll wear daily', href: '/categories/hair-accessories' },
          { text: 'Flower Pot Arrangements — Beautiful desk décor for her room', href: '/categories/flower-pots' },
        ],
      },
      {
        heading: 'Shop by Occasion',
        level: 'h3',
        bullets: [
          { text: 'Birthday gifts for girlfriend', href: '/gifts/birthday' },
          { text: 'Valentine\'s Day gifts', href: '/gifts/valentines-day' },
          { text: 'Anniversary gifts', href: '/gifts/anniversary' },
        ],
      },
      {
        heading: 'Shop by Budget',
        level: 'h3',
        bullets: [
          { text: 'Gifts under ₹300', href: '/gifts/under-300' },
          { text: 'Gifts under ₹500', href: '/gifts/under-500' },
          { text: 'Premium gifts', href: '/gifts/premium' },
        ],
      },
    ],
    relatedSlugs: ['for-boyfriend', 'valentines-day', 'birthday', 'anniversary'],
  },

  {
    slug: 'for-boyfriend',
    title: 'Crochet Gifts for Boyfriend | Unique Handmade Gift Ideas for Him India',
    description: 'Find unique handmade gifts for your boyfriend! Crochet keychains, custom character plushies, and personalized gifts he\'ll actually love. Delivered across India.',
    ogDescription: 'Find unique handmade gifts for your boyfriend! Crochet keychains, custom plushies, and personalized gifts.',
    hero: {
      badge: '🎁 Something He\'ll Love',
      heading: 'Gifts for Boyfriend',
      subheading: 'Skip the boring wallet or perfume. Gift him a handmade crochet keychain of his favorite character, a custom plush toy, or something truly personal that shows you get him.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Boyfriend',
    gridLabel: 'Gift ideas for boyfriend',
    itemListName: 'Crochet Gifts for Boyfriend',
    seoArticle: [
      {
        heading: 'Handmade Gifts He\'ll Actually Use',
        level: 'h2',
        paragraphs: [
          'Finding a gift for your boyfriend that isn\'t boring can feel impossible. That\'s where handmade crochet gifts come in — a Pikachu keychain he\'ll attach to his bag, a custom plush of his favorite anime character, or a personalized creation that becomes his new favorite thing. These aren\'t generic gifts. They\'re made for him.',
        ],
      },
      {
        heading: 'Best Gifts for Boyfriend',
        level: 'h3',
        bullets: [
          { text: 'Character Keychains — Pikachu, dinosaur, bear, and more', href: '/categories/keychains' },
          { text: 'Amigurumi Plush Toys — His favorite character, handmade', href: '/categories/toys' },
          { text: 'Custom Crochet — Design a one-of-a-kind gift for him', href: '/custom' },
        ],
      },
      {
        heading: 'Shop by Occasion',
        level: 'h3',
        bullets: [
          { text: 'Birthday gifts for boyfriend', href: '/gifts/birthday' },
          { text: 'Valentine\'s Day gifts for him', href: '/gifts/valentines-day' },
          { text: 'Anniversary gifts', href: '/gifts/anniversary' },
        ],
      },
    ],
    relatedSlugs: ['for-girlfriend', 'valentines-day', 'birthday', 'under-500'],
  },

  {
    slug: 'for-wife',
    title: 'Crochet Gifts for Wife | Beautiful Handmade Gift Ideas India',
    description: 'Surprise your wife with a beautiful handmade gift! Premium crochet flower bouquets, flower pot arrangements, and custom creations that last forever. Delivered across India.',
    ogDescription: 'Surprise your wife with beautiful handmade crochet flower bouquets and premium gifts that last forever.',
    hero: {
      badge: '💐 She Deserves the Best',
      heading: 'Gifts for Wife',
      subheading: 'She\'s your everything — and she deserves a gift that reflects that. Our premium handmade bouquets and crochet arrangements are gifts she\'ll treasure forever, just like your love.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'hair-accessories'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'For Wife',
    gridLabel: 'Gift ideas for wife',
    itemListName: 'Crochet Gifts for Wife',
    seoArticle: [
      {
        heading: 'Why She\'ll Love a Handmade Gift',
        level: 'h2',
        paragraphs: [
          'Real flowers die in a week. A crochet bouquet? It becomes a permanent part of your home — a reminder of your love that she sees every day. Our handmade gifts for wives are premium, carefully crafted pieces that show the kind of thoughtfulness she deserves.',
        ],
      },
      {
        heading: 'Top Gift Ideas for Wife',
        level: 'h3',
        bullets: [
          { text: 'Premium Flower Bouquets — Large, romantic tulip and rose arrangements', href: '/categories/flower-bouquets' },
          { text: 'Flower Pot Arrangements — Beautiful desk or shelf décor', href: '/categories/flower-pots' },
          { text: 'Hair Accessories — Elegant handmade crochet accessories', href: '/categories/hair-accessories' },
          { text: 'Custom Gifts — Commission a bespoke creation in her favorite colors', href: '/custom' },
        ],
      },
      {
        heading: 'Perfect Occasions',
        level: 'h3',
        bullets: [
          { text: 'Anniversary gifts', href: '/gifts/anniversary' },
          { text: 'Birthday gifts', href: '/gifts/birthday' },
          { text: 'Mother\'s Day gifts', href: '/gifts/mothers-day' },
          { text: 'Valentine\'s Day gifts', href: '/gifts/valentines-day' },
        ],
      },
    ],
    relatedSlugs: ['for-husband', 'anniversary', 'mothers-day', 'premium'],
  },

  {
    slug: 'for-husband',
    title: 'Crochet Gifts for Husband | Unique Handmade Gift Ideas India',
    description: 'Find the perfect handmade gift for your husband! Unique crochet keychains, custom plush toys, and personalized gifts he\'ll treasure. Delivered across India.',
    ogDescription: 'Find unique handmade gifts for your husband! Crochet keychains and custom personalized gifts.',
    hero: {
      badge: '🎯 Thoughtfully Crafted',
      heading: 'Gifts for Husband',
      subheading: 'Because he deserves more than a tie. Surprise him with a handmade crochet keychain he\'ll carry every day, or commission a custom plush of something he loves.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Husband',
    gridLabel: 'Gift ideas for husband',
    itemListName: 'Crochet Gifts for Husband',
    seoArticle: [
      {
        heading: 'Handmade Gifts That Break the Mold',
        level: 'h2',
        paragraphs: [
          'Tired of giving him the same old wallet, watch, or perfume? A handmade crochet gift is refreshingly different. It\'s personal, unexpected, and shows you put real thought into it. From fun character keychains to custom plush toys of his favorite things — these gifts stand out.',
        ],
      },
      {
        heading: 'Gift Ideas for Husband',
        level: 'h3',
        bullets: [
          { text: 'Fun Character Keychains — Attach to his keys, bag, or bike', href: '/categories/keychains' },
          { text: 'Custom Plush — His favorite character or hobby, handmade', href: '/custom' },
          { text: 'Couple Keychains — Matching set for both of you', href: '/categories/keychains' },
        ],
      },
    ],
    relatedSlugs: ['for-wife', 'anniversary', 'fathers-day', 'birthday'],
  },

  {
    slug: 'for-mom',
    title: 'Crochet Gifts for Mom | Beautiful Handmade Gifts for Mother India',
    description: 'Make Mom smile with a handmade gift! Crochet flower bouquets, flower pot arrangements, and hair accessories she\'ll love. Perfect for birthdays and Mother\'s Day. Delivered across India.',
    ogDescription: 'Make Mom smile with handmade crochet flower bouquets and beautiful gifts she\'ll treasure.',
    hero: {
      badge: '🌸 For the Best Mom',
      heading: 'Gifts for Mom',
      subheading: 'She gave you everything — give her something that shows how much she means. Our handmade crochet bouquets and flower arrangements are gifts Mom will treasure forever.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Mom',
    gridLabel: 'Gift ideas for mom',
    itemListName: 'Crochet Gifts for Mom',
    seoArticle: [
      {
        heading: 'Why Moms Love Handmade Gifts',
        level: 'h2',
        paragraphs: [
          'Moms don\'t care about price tags — they care about thoughtfulness. A handmade crochet gift is the ultimate expression of care. Whether it\'s a vibrant flower bouquet for her living room or a delicate hair clip she\'ll wear to work, these gifts tell Mom she\'s special in a way no store-bought item can.',
        ],
      },
      {
        heading: 'Top Gifts for Mom',
        level: 'h3',
        bullets: [
          { text: 'Crochet Flower Bouquets — Beautiful arrangements that never wilt', href: '/categories/flower-bouquets' },
          { text: 'Flower Pot Arrangements — Perfect for her desk or windowsill', href: '/categories/flower-pots' },
          { text: 'Hair Accessories — Elegant clips and ties she can wear daily', href: '/categories/hair-accessories' },
          { text: 'Custom Gifts — Her favorite flowers, custom-made in crochet', href: '/custom' },
        ],
      },
      {
        heading: 'Perfect Occasions',
        level: 'h3',
        bullets: [
          { text: 'Mother\'s Day gifts', href: '/gifts/mothers-day' },
          { text: 'Birthday gifts for mom', href: '/gifts/birthday' },
          { text: 'Gifts under ₹500', href: '/gifts/under-500' },
        ],
      },
    ],
    relatedSlugs: ['mothers-day', 'for-dad', 'birthday', 'under-500'],
  },

  {
    slug: 'for-dad',
    title: 'Crochet Gifts for Dad | Unique Handmade Gifts for Father India',
    description: 'Find thoughtful handmade gifts for Dad! Unique crochet keychains, custom designs, and personalized gifts. Perfect for Father\'s Day and birthdays. Delivered across India.',
    ogDescription: 'Find thoughtful handmade gifts for Dad! Unique crochet keychains and personalized custom gifts.',
    hero: {
      badge: '🧔 For the Coolest Dad',
      heading: 'Gifts for Dad',
      subheading: 'He\'s always there for you — now surprise him with a gift that shows you notice. A handmade crochet keychain he\'ll carry everywhere, or a custom creation that celebrates his hobby.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Dad',
    gridLabel: 'Gift ideas for dad',
    itemListName: 'Crochet Gifts for Dad',
    seoArticle: [
      {
        heading: 'Gifts That Make Dad Smile',
        level: 'h2',
        paragraphs: [
          'Dads are notoriously hard to shop for — but not anymore. A handmade crochet keychain of his favorite character or a custom-designed piece that reflects his personality is something he won\'t expect, and that\'s exactly why he\'ll love it.',
        ],
      },
      {
        heading: 'Gift Ideas for Dad',
        level: 'h3',
        bullets: [
          { text: 'Character Keychains — Fun designs he\'ll proudly carry', href: '/categories/keychains' },
          { text: 'Custom Crochet — His car, his pet, his favorite sports team, made in yarn', href: '/custom' },
        ],
      },
      {
        heading: 'Perfect Occasions',
        level: 'h3',
        bullets: [
          { text: 'Father\'s Day gifts', href: '/gifts/fathers-day' },
          { text: 'Birthday gifts for dad', href: '/gifts/birthday' },
          { text: 'Budget-friendly gifts under ₹300', href: '/gifts/under-300' },
        ],
      },
    ],
    relatedSlugs: ['fathers-day', 'for-mom', 'under-300', 'birthday'],
  },

  {
    slug: 'for-sister',
    title: 'Crochet Gifts for Sister | Cute Handmade Gift Ideas India',
    description: 'Find the cutest handmade gifts for your sister! Crochet hair accessories, keychains, flower bouquets, and more. Perfect for Raksha Bandhan and birthdays. Delivered across India.',
    ogDescription: 'Find the cutest handmade gifts for your sister! Crochet hair accessories, keychains, and bouquets.',
    hero: {
      badge: '👭 For Your Didi / Sis',
      heading: 'Gifts for Sister',
      subheading: 'She\'s your first friend and forever ally. Whether it\'s Raksha Bandhan or her birthday, give her a handmade gift that matches her sparkle — crochet hair clips, cute keychains, or flower bouquets.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories', 'keychains', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Sister',
    gridLabel: 'Gift ideas for sister',
    itemListName: 'Crochet Gifts for Sister',
    seoArticle: [
      {
        heading: 'Gifts She\'ll Actually Love',
        level: 'h2',
        paragraphs: [
          'Sisters know when you\'ve put effort into a gift — and handmade always wins. Our crochet gifts for sisters range from stylish hair accessories she\'ll wear every day to adorable keychains she can attach to her bag. Every piece is handmade with love and attention to detail.',
        ],
      },
      {
        heading: 'Top Gifts for Sister',
        level: 'h3',
        bullets: [
          { text: 'Crochet Hair Clips — Daisy, heart, sunflower, and bow clips', href: '/categories/hair-accessories' },
          { text: 'Cute Keychains — Animal and character designs she\'ll adore', href: '/categories/keychains' },
          { text: 'Mini Flower Bouquets — A tiny bouquet for her room', href: '/categories/flower-bouquets' },
        ],
      },
      {
        heading: 'Perfect Occasions',
        level: 'h3',
        bullets: [
          { text: 'Raksha Bandhan gifts', href: '/gifts/raksha-bandhan' },
          { text: 'Birthday gifts', href: '/gifts/birthday' },
          { text: 'Budget gifts under ₹300', href: '/gifts/under-300' },
        ],
      },
    ],
    relatedSlugs: ['for-brother', 'raksha-bandhan', 'under-300', 'for-best-friend'],
  },

  {
    slug: 'for-brother',
    title: 'Crochet Gifts for Brother | Cool Handmade Gift Ideas India',
    description: 'Find cool handmade gifts for your brother! Crochet keychains, plush toys, and custom designs. Perfect for Raksha Bandhan and birthdays. Delivered across India.',
    ogDescription: 'Find cool handmade gifts for your brother! Crochet keychains, plush toys, and custom designs.',
    hero: {
      badge: '🤜🤛 For Your Bro',
      heading: 'Gifts for Brother',
      subheading: 'Whether he\'s into anime, gaming, or just being cool — we\'ve got a crochet keychain or plush that matches his vibe. Handmade gifts he\'ll actually want to keep.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Brother',
    gridLabel: 'Gift ideas for brother',
    itemListName: 'Crochet Gifts for Brother',
    seoArticle: [
      {
        heading: 'Gifts as Cool as Your Brother',
        level: 'h2',
        paragraphs: [
          'Finding a gift for your brother that isn\'t lame? Challenge accepted. Our crochet keychains and plush toys feature characters and designs that bros actually like — from Pikachu and dinosaurs to custom designs of his favorite things.',
        ],
      },
      {
        heading: 'Gift Ideas for Brother',
        level: 'h3',
        bullets: [
          { text: 'Character Keychains — Pikachu, dinosaur, teddy bear, and more', href: '/categories/keychains' },
          { text: 'Amigurumi Plush Toys — Larger, detailed character plushies', href: '/categories/toys' },
          { text: 'Custom Crochet — Any character or design, made to order', href: '/custom' },
        ],
      },
      {
        heading: 'Perfect Occasions',
        level: 'h3',
        bullets: [
          { text: 'Raksha Bandhan gifts', href: '/gifts/raksha-bandhan' },
          { text: 'Birthday gifts', href: '/gifts/birthday' },
          { text: 'Budget gifts under ₹300', href: '/gifts/under-300' },
        ],
      },
    ],
    relatedSlugs: ['for-sister', 'raksha-bandhan', 'under-300', 'birthday'],
  },

  {
    slug: 'for-best-friend',
    title: 'Crochet Gifts for Best Friend | Cute Handmade BFF Gifts India',
    description: 'Find the perfect handmade gift for your best friend! Cute crochet keychains, mini plushies, and matching gifts. Budget-friendly BFF gifts delivered across India.',
    ogDescription: 'Find the perfect handmade gift for your bestie! Cute crochet keychains and matching BFF gifts.',
    hero: {
      badge: '🫂 For Your Bestie',
      heading: 'Gifts for Best Friend',
      subheading: 'They get you like nobody else — so get them a gift that\'s as unique as your friendship. Cute keychains they can hang on their bag, mini plushies for their desk, or matching BFF accessories.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Best Friend',
    gridLabel: 'Gift ideas for best friend',
    itemListName: 'Crochet Gifts for Best Friend',
    seoArticle: [
      {
        heading: 'Gifts That Say "You\'re My Person"',
        level: 'h2',
        paragraphs: [
          'Your best friend deserves more than a last-minute Amazon order. A handmade crochet gift — whether it\'s a matching set of keychains, a mini plushie, or a cute hair clip — shows real thought. Plus, they\'re Instagram-worthy, which your bestie will definitely appreciate.',
        ],
      },
      {
        heading: 'BFF Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Matching Keychains — Get a pair for both of you!', href: '/categories/keychains' },
          { text: 'Mini Plush Toys — Cute desk companions', href: '/categories/toys' },
          { text: 'Hair Accessories — Twinning crochet clips', href: '/categories/hair-accessories' },
          { text: 'Custom Gifts — Inside jokes, made tangible', href: '/custom' },
        ],
      },
      {
        heading: 'Budget-Friendly Options',
        level: 'h3',
        paragraphs: [
          'Most of our BFF-worthy gifts are under ₹300, so you can treat your whole squad without breaking the bank.',
        ],
        bullets: [
          { text: 'Browse gifts under ₹300 →', href: '/gifts/under-300' },
          { text: 'Friendship Day gifts →', href: '/gifts/friendship-day' },
        ],
      },
    ],
    relatedSlugs: ['friendship-day', 'under-300', 'for-sister', 'birthday'],
  },

  {
    slug: 'for-couples',
    title: 'Crochet Gifts for Couples | Matching Handmade Gifts India',
    description: 'Shop matching handmade gifts for couples! Pair keychains, couple bouquets, and custom crochet gifts for anniversaries, weddings, and Valentine\'s Day. Delivered across India.',
    ogDescription: 'Shop matching handmade gifts for couples! Pair keychains, couple bouquets, and custom gifts.',
    hero: {
      badge: '👫 Made for Two',
      heading: 'Gifts for Couples',
      subheading: 'Celebrate love with matching handmade gifts. Pair keychains for their bags, a beautiful bouquet for their home, or a custom creation that tells their love story in yarn.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'flower-bouquets', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Couples',
    gridLabel: 'Gift ideas for couples',
    itemListName: 'Crochet Gifts for Couples',
    seoArticle: [
      {
        heading: 'Why Couples Love Handmade Gifts',
        level: 'h2',
        paragraphs: [
          'A handmade gift for a couple isn\'t just a present — it\'s a shared memory. Matching crochet keychains they both carry, a flower bouquet that sits in their living room, or a custom creation that commemorates their story. These are the gifts that become part of a couple\'s life together.',
        ],
      },
      {
        heading: 'Couple Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Matching Keychains — His & hers character designs', href: '/categories/keychains' },
          { text: 'Flower Bouquets — A romantic centerpiece for their home', href: '/categories/flower-bouquets' },
          { text: 'Flower Pot Arrangements — Desk décor that brightens their space', href: '/categories/flower-pots' },
          { text: 'Custom Couple Gifts — Personalized designs for their anniversary', href: '/custom' },
        ],
      },
      {
        heading: 'Perfect Occasions',
        level: 'h3',
        bullets: [
          { text: 'Wedding gifts', href: '/gifts/wedding' },
          { text: 'Anniversary gifts', href: '/gifts/anniversary' },
          { text: 'Engagement gifts', href: '/gifts/engagement' },
          { text: 'Valentine\'s Day gifts', href: '/gifts/valentines-day' },
        ],
      },
    ],
    relatedSlugs: ['wedding', 'anniversary', 'engagement', 'valentines-day'],
  },

  // ═══════════════════════════════════════════
  // NEW OCCASION PAGES
  // ═══════════════════════════════════════════

  {
    slug: 'mothers-day',
    title: "Mother's Day Gifts | Handmade Crochet Gifts for Mom India",
    description: "Shop handmade Mother's Day gifts! Beautiful crochet flower bouquets, flower pots, and hair accessories for Mom. Unique gifts delivered across India.",
    ogDescription: "Shop handmade Mother's Day gifts! Beautiful crochet flower bouquets and unique gifts for Mom.",
    hero: {
      badge: '🌷 Happy Mother\'s Day',
      heading: "Mother's Day Gifts",
      subheading: "This Mother's Day, give her something that lasts as long as her love. Our handmade crochet bouquets and flower arrangements are gifts she'll treasure — not just for a week, but forever.",
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: "Mother's Day Gifts",
    gridLabel: "Mother's Day gift ideas",
    itemListName: "Mother's Day Gifts",
    seoArticle: [
      {
        heading: "Make Mother's Day Unforgettable",
        level: 'h2',
        paragraphs: [
          "Mom deserves more than a single day of appreciation — but since it's Mother's Day, make it count. Our handmade crochet gifts are crafted with the same love and care she gives you every day. A forever flower bouquet, a beautiful pot arrangement for her desk, or elegant hair accessories she can wear with pride.",
        ],
      },
      {
        heading: "Mother's Day Gift Ideas",
        level: 'h3',
        bullets: [
          { text: 'Forever Flower Bouquets — Tulips, roses, and sunflowers in yarn', href: '/categories/flower-bouquets' },
          { text: 'Desk Flower Pots — Beautiful arrangements for her workspace', href: '/categories/flower-pots' },
          { text: 'Hair Accessories — Elegant crochet clips and ties', href: '/categories/hair-accessories' },
          { text: 'Custom Gifts — Her favorite flowers, handmade to order', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['for-mom', 'for-wife', 'premium', 'under-500'],
  },

  {
    slug: 'fathers-day',
    title: "Father's Day Gifts | Unique Handmade Crochet Gifts for Dad India",
    description: "Shop unique Father's Day gifts! Handmade crochet keychains, custom designs, and personalized gifts Dad will love. Affordable gifts delivered across India.",
    ogDescription: "Shop unique Father's Day gifts! Handmade crochet keychains and personalized gifts Dad will love.",
    hero: {
      badge: '👔 Happy Father\'s Day',
      heading: "Father's Day Gifts",
      subheading: "Dad never asks for anything — so surprise him with something he'd never buy himself. A handmade crochet keychain, a custom design, or a fun plush toy that shows you know him best.",
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: "Father's Day Gifts",
    gridLabel: "Father's Day gift ideas",
    itemListName: "Father's Day Gifts",
    seoArticle: [
      {
        heading: "Gifts Dad Will Be Surprised By",
        level: 'h2',
        paragraphs: [
          "Let's be honest — dads are the hardest to shop for. But that's exactly why a handmade gift works so well. It's unexpected, thoughtful, and different from the usual tie or mug. Our crochet keychains and custom creations give you a way to show Dad you really thought about him this Father's Day.",
        ],
      },
      {
        heading: "Father's Day Gift Ideas",
        level: 'h3',
        bullets: [
          { text: 'Character Keychains — Fun, everyday-carry gifts', href: '/categories/keychains' },
          { text: 'Custom Designs — His car, pet, or hobby in crochet', href: '/custom' },
          { text: 'Budget picks under ₹300', href: '/gifts/under-300' },
        ],
      },
    ],
    relatedSlugs: ['for-dad', 'for-mom', 'under-300', 'birthday'],
  },

  {
    slug: 'friendship-day',
    title: 'Friendship Day Gifts | Cute Handmade Gifts for Friends India',
    description: 'Celebrate Friendship Day with cute handmade gifts! Crochet keychains, matching BFF accessories, and mini plushies. Affordable gifts for your squad delivered across India.',
    ogDescription: 'Celebrate Friendship Day with cute handmade crochet keychains and matching BFF gifts!',
    hero: {
      badge: '🤝 Happy Friendship Day',
      heading: 'Friendship Day Gifts',
      subheading: "Your squad deserves the best! Cute matching keychains, mini plushies, and handmade accessories that celebrate your friendship. Most are under ₹300 — so you can treat the whole gang.",
    },
    productFilter: { type: 'category', slugs: ['keychains', 'hair-accessories', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Friendship Day Gifts',
    gridLabel: 'Friendship Day gift ideas',
    itemListName: 'Friendship Day Gifts',
    seoArticle: [
      {
        heading: 'Celebrate Your Squad with Handmade Gifts',
        level: 'h2',
        paragraphs: [
          'Friendship Day is the perfect excuse to show your friends some love. Our crochet gifts are cute, affordable, and perfect for gifting in bulk. Get matching keychains for your friend group, cute hair clips for your girlfriends, or mini plush toys that make perfect desk companions.',
        ],
      },
      {
        heading: 'Friendship Day Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Matching Keychains — Get a set for the whole squad', href: '/categories/keychains' },
          { text: 'Hair Accessories — Cute clips to share with your besties', href: '/categories/hair-accessories' },
          { text: 'Mini Plush Toys — Adorable desk companions', href: '/categories/toys' },
        ],
      },
      {
        heading: 'Budget-Friendly Squad Gifts',
        level: 'h3',
        paragraphs: [
          'Gifting multiple friends? Our under ₹200 and under ₹300 collections are perfect for treating everyone without overspending.',
        ],
        bullets: [
          { text: 'Gifts under ₹200', href: '/gifts/under-200' },
          { text: 'Gifts under ₹300', href: '/gifts/under-300' },
        ],
      },
    ],
    relatedSlugs: ['for-best-friend', 'under-200', 'under-300', 'birthday'],
  },

  {
    slug: 'wedding',
    title: 'Wedding Gifts | Handmade Crochet Wedding Gift Ideas India',
    description: 'Shop premium handmade wedding gifts! Crochet flower bouquets, flower pot arrangements, and custom couple gifts. Unique wedding gifts delivered across India.',
    ogDescription: 'Shop premium handmade wedding gifts! Crochet flower bouquets and unique gifts for couples.',
    hero: {
      badge: '💒 For the Happy Couple',
      heading: 'Wedding Gifts',
      subheading: "Give the newlyweds a gift as timeless as their love. Our handmade crochet bouquets and arrangements make stunning wedding gifts that the couple will display in their new home forever.",
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'keychains'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Wedding Gifts',
    gridLabel: 'Wedding gift ideas',
    itemListName: 'Wedding Gifts',
    seoArticle: [
      {
        heading: 'Handmade Wedding Gifts That Stand Out',
        level: 'h2',
        paragraphs: [
          "Wedding gifts should be memorable — not another appliance they'll forget about. A handmade crochet flower bouquet or arrangement becomes a centerpiece in the couple's home, a conversation starter, and a lasting reminder of their special day. These are the gifts that get remembered.",
        ],
      },
      {
        heading: 'Wedding Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Premium Flower Bouquets — Stunning arrangements perfect for display', href: '/categories/flower-bouquets' },
          { text: 'Flower Pot Arrangements — Beautiful home décor for the new couple', href: '/categories/flower-pots' },
          { text: 'Matching Couple Keychains — A sweet, personal touch', href: '/categories/keychains' },
          { text: 'Custom Wedding Gifts — Personalized pieces with their names or wedding colors', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['for-couples', 'engagement', 'premium', 'anniversary'],
  },

  {
    slug: 'baby-shower',
    title: 'Baby Shower Gifts | Handmade Crochet Baby Gifts India',
    description: 'Shop adorable baby shower gifts! Soft crochet amigurumi plush toys, baby-safe handmade gifts, and cute nursery décor. Unique baby gifts delivered across India.',
    ogDescription: 'Shop adorable baby shower gifts! Soft crochet amigurumi plush toys and baby-safe handmade gifts.',
    hero: {
      badge: '🍼 Welcome Little One',
      heading: 'Baby Shower Gifts',
      subheading: 'Welcome the newest member of the family with a soft, huggable handmade gift. Our crochet amigurumi plush toys are safe, cute, and made to become their first best friend.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Baby Shower Gifts',
    gridLabel: 'Baby shower gift ideas',
    itemListName: 'Baby Shower Gifts',
    seoArticle: [
      {
        heading: 'Safe, Soft, and Made with Love',
        level: 'h2',
        paragraphs: [
          "Baby shower gifts should be special — and what's more special than a handmade toy? Our crochet amigurumi plush toys are soft, cuddly, and made with baby-safe materials. They make perfect nursery décor and a child's first lovey. Each one is unique, ensuring the baby gets something no one else has.",
        ],
      },
      {
        heading: 'Baby Shower Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Amigurumi Plush Toys — Soft bunnies, bears, and more', href: '/categories/toys' },
          { text: 'Custom Baby Gifts — Personalized with the baby\'s name or favorite colors', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['for-mom', 'under-500', 'under-1000', 'for-couples'],
  },

  {
    slug: 'engagement',
    title: 'Engagement Gifts | Handmade Crochet Gifts for Couples India',
    description: 'Celebrate their engagement with unique handmade gifts! Crochet flower bouquets, couple keychains, and custom gifts for the newly engaged. Delivered across India.',
    ogDescription: 'Celebrate their engagement with unique handmade crochet gifts! Flower bouquets and couple gifts.',
    hero: {
      badge: '💍 Congratulations!',
      heading: 'Engagement Gifts',
      subheading: "They said yes! Celebrate this beautiful milestone with a handmade gift that's as romantic as their love story. Forever flower bouquets, matching keychains, and custom creations for the couple.",
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'keychains', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Engagement Gifts',
    gridLabel: 'Engagement gift ideas',
    itemListName: 'Engagement Gifts',
    seoArticle: [
      {
        heading: 'Celebrate Their New Chapter',
        level: 'h2',
        paragraphs: [
          'An engagement marks the beginning of a beautiful journey together. Give the happy couple a gift that symbolizes lasting love — a crochet flower bouquet that never wilts, matching keychains they can carry together, or a custom-designed piece that celebrates their story.',
        ],
      },
      {
        heading: 'Engagement Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Forever Flower Bouquets — Romantic arrangements that last a lifetime', href: '/categories/flower-bouquets' },
          { text: 'Matching Couple Keychains — His & hers designs', href: '/categories/keychains' },
          { text: 'Custom Couple Gifts — Personalized engagement keepsakes', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['wedding', 'for-couples', 'anniversary', 'premium'],
  },

  {
    slug: 'graduation',
    title: 'Graduation Gifts | Handmade Crochet Graduation Gift Ideas India',
    description: 'Celebrate their achievement with unique handmade graduation gifts! Crochet flower bouquets, keychains, and custom gifts. Perfect graduation gifts delivered across India.',
    ogDescription: 'Celebrate graduation with unique handmade crochet gifts! Flower bouquets and keychains.',
    hero: {
      badge: '🎓 Congratulations, Graduate!',
      heading: 'Graduation Gifts',
      subheading: "They worked hard for this moment — celebrate it with a handmade gift that's as special as their achievement. A forever flower bouquet for the ceremony or a custom keychain they'll carry into their new chapter.",
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Graduation Gifts',
    gridLabel: 'Graduation gift ideas',
    itemListName: 'Graduation Gifts',
    seoArticle: [
      {
        heading: 'Gifts for a Milestone Achievement',
        level: 'h2',
        paragraphs: [
          'Graduation is one of life\'s biggest milestones — and the gift should match. A handmade crochet flower bouquet is perfect for the ceremony (and lasts forever, unlike real bouquets). A custom keychain becomes a memento they carry into their new chapter. These are gifts that celebrate hard work and new beginnings.',
        ],
      },
      {
        heading: 'Graduation Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Crochet Flower Bouquets — Perfect for the ceremony and display after', href: '/categories/flower-bouquets' },
          { text: 'Character Keychains — A fun memento for the next chapter', href: '/categories/keychains' },
          { text: 'Custom Graduation Gifts — Personalized designs for the graduate', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['for-best-friend', 'under-500', 'under-1000', 'birthday'],
  },

  {
    slug: 'housewarming',
    title: 'Housewarming Gifts | Handmade Crochet Home Décor India',
    description: 'Shop handmade housewarming gifts! Crochet flower pot arrangements, forever bouquets, and unique home décor that lasts forever. Delivered across India.',
    ogDescription: 'Shop handmade housewarming gifts! Crochet flower pots and forever bouquets for the new home.',
    hero: {
      badge: '🏠 Welcome Home',
      heading: 'Housewarming Gifts',
      subheading: 'Help them make their new house a home with a handmade gift that adds warmth and beauty. Our crochet flower arrangements and décor pieces are conversation starters that never need watering.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Housewarming Gifts',
    gridLabel: 'Housewarming gift ideas',
    itemListName: 'Housewarming Gifts',
    seoArticle: [
      {
        heading: 'Home Décor That Never Needs Watering',
        level: 'h2',
        paragraphs: [
          'A new home deserves something special on the shelf. Our handmade crochet flower arrangements and pot designs add a unique touch of warmth and color to any room. Unlike real plants, they never need watering, never wilt, and look beautiful year-round. They\'re the housewarming gift that keeps on giving.',
        ],
      },
      {
        heading: 'Housewarming Gift Ideas',
        level: 'h3',
        bullets: [
          { text: 'Flower Pot Arrangements — Colorful desk or shelf décor', href: '/categories/flower-pots' },
          { text: 'Flower Bouquets — Stunning arrangements for the living room', href: '/categories/flower-bouquets' },
          { text: 'Custom Home Décor — Designed in their favorite colors', href: '/custom' },
        ],
      },
    ],
    relatedSlugs: ['wedding', 'premium', 'for-couples', 'anniversary'],
  },

  {
    slug: 'teachers-day',
    title: "Teacher's Day Gifts | Handmade Crochet Gifts for Teachers India",
    description: "Shop thoughtful Teacher's Day gifts! Handmade crochet flower bouquets, keychains, and unique gifts to thank your favorite teacher. Affordable gifts delivered across India.",
    ogDescription: "Shop thoughtful Teacher's Day gifts! Handmade crochet flower bouquets and keychains for teachers.",
    hero: {
      badge: '📚 Thank You, Teacher',
      heading: "Teacher's Day Gifts",
      subheading: "Show your favorite teacher they made a difference with a handmade gift from the heart. A crochet flower bouquet for their desk or a cute keychain they'll carry with pride.",
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: "Teacher's Day Gifts",
    gridLabel: "Teacher's Day gift ideas",
    itemListName: "Teacher's Day Gifts",
    seoArticle: [
      {
        heading: 'Gifts That Say Thank You',
        level: 'h2',
        paragraphs: [
          "Teachers shape our lives — and they deserve more than a generic mug. A handmade crochet flower bouquet for their desk, a cute keychain, or a small flower pot arrangement is a thoughtful way to say 'thank you' that they'll remember long after Teacher's Day.",
        ],
      },
      {
        heading: "Teacher's Day Gift Ideas",
        level: 'h3',
        bullets: [
          { text: 'Mini Flower Bouquets — Perfect desk décor for the staffroom', href: '/categories/flower-bouquets' },
          { text: 'Flower Pot Arrangements — A lasting thank-you on their desk', href: '/categories/flower-pots' },
          { text: 'Cute Keychains — Fun, affordable appreciation tokens', href: '/categories/keychains' },
        ],
      },
      {
        heading: 'Budget-Friendly Options',
        level: 'h3',
        paragraphs: [
          'Most of our teacher-appropriate gifts are available in budget-friendly ranges:',
        ],
        bullets: [
          { text: 'Gifts under ₹200', href: '/gifts/under-200' },
          { text: 'Gifts under ₹300', href: '/gifts/under-300' },
        ],
      },
    ],
    relatedSlugs: ['under-200', 'under-300', 'graduation', 'for-best-friend'],
  },

  // ═══════════════════════════════════════════
  // MORE RECIPIENT PAGES
  // ═══════════════════════════════════════════

  {
    slug: 'for-friend',
    title: 'Handmade Gifts for Friend | Cute Crochet Gifts India',
    description: 'Find the perfect handmade gift for your friend. Cute crochet keychains, mini plushies, and thoughtful accessories. Delivered across India.',
    ogDescription: 'Find the perfect handmade gift for your friend. Cute crochet keychains and mini plushies.',
    hero: {
      badge: '💛 For Your Friend',
      heading: 'Gifts for Friend',
      subheading: 'Show them how much you care with a thoughtful handmade crochet gift. Cute keychains, plushies, and more.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Friend',
    gridLabel: 'Gift ideas for friend',
    itemListName: 'Crochet Gifts for Friend',
    seoArticle: [
      {
        heading: 'Thoughtful Gifts for Friends',
        level: 'h2',
        paragraphs: ['Celebrate your friendship with a unique, handmade crochet gift that they will cherish forever.']
      }
    ],
    relatedSlugs: ['for-best-friend', 'friendship-day', 'under-300'],
  },
  {
    slug: 'for-her',
    title: 'Handmade Gifts for Her | Cute Crochet Gifts India',
    description: 'Shop beautiful handmade gifts for her. Crochet flower bouquets, cute hair accessories, and plush toys. Premium gifts delivered across India.',
    ogDescription: 'Shop beautiful handmade gifts for her. Crochet flower bouquets, cute hair accessories, and plush toys.',
    hero: {
      badge: '🌸 Just for Her',
      heading: 'Gifts for Her',
      subheading: 'Find the perfect handmade gift for the special woman in your life. Beautiful crochet bouquets, accessories, and plushies.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'hair-accessories', 'toys', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Her',
    gridLabel: 'Gift ideas for her',
    itemListName: 'Crochet Gifts for Her',
    seoArticle: [
      {
        heading: 'Beautiful Handmade Gifts for Her',
        level: 'h2',
        paragraphs: ['Make her day special with our handcrafted crochet gifts, made with premium materials and lots of love.']
      }
    ],
    relatedSlugs: ['for-girlfriend', 'for-wife', 'valentines-day'],
  },
  {
    slug: 'for-him',
    title: 'Handmade Gifts for Him | Unique Crochet Gifts India',
    description: 'Discover unique handmade gifts for him. Crochet keychains, character plushies, and custom gifts he\'ll actually love. Delivered across India.',
    ogDescription: 'Discover unique handmade gifts for him. Crochet keychains, character plushies, and custom gifts.',
    hero: {
      badge: '🧔 Just for Him',
      heading: 'Gifts for Him',
      subheading: 'Skip the generic gifts and surprise him with a fun, handmade crochet keychain or custom plushie.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Him',
    gridLabel: 'Gift ideas for him',
    itemListName: 'Crochet Gifts for Him',
    seoArticle: [
      {
        heading: 'Unique Handmade Gifts for Him',
        level: 'h2',
        paragraphs: ['Find thoughtful and unique handmade gifts that he will actually use and appreciate.']
      }
    ],
    relatedSlugs: ['for-boyfriend', 'for-husband', 'anniversary'],
  },
  {
    slug: 'for-newlyweds',
    title: 'Gifts for Newlyweds | Handmade Couple Gifts India',
    description: 'Shop thoughtful handmade gifts for newlyweds. Crochet flower bouquets, couple keychains, and elegant home decor. Delivered across India.',
    ogDescription: 'Shop thoughtful handmade gifts for newlyweds. Crochet flower bouquets, couple keychains, and home decor.',
    hero: {
      badge: '💒 Just Married',
      heading: 'Gifts for Newlyweds',
      subheading: 'Celebrate the happy couple with a handmade gift for their new home, like a beautiful crochet bouquet or matching keychains.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'keychains'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'For Newlyweds',
    gridLabel: 'Gift ideas for newlyweds',
    itemListName: 'Crochet Gifts for Newlyweds',
    seoArticle: [
      {
        heading: 'Memorable Gifts for Newlyweds',
        level: 'h2',
        paragraphs: ['Give the newlyweds a unique, handmade gift that will become a cherished part of their new home together.']
      }
    ],
    relatedSlugs: ['wedding', 'for-couples', 'housewarming'],
  },
  {
    slug: 'for-bride',
    title: 'Gifts for Bride | Handmade Bridal Gifts India',
    description: 'Find beautiful handmade gifts for the bride. Crochet flower bouquets, hair accessories, and custom gifts. Delivered across India.',
    ogDescription: 'Find beautiful handmade gifts for the bride. Crochet flower bouquets, hair accessories, and custom gifts.',
    hero: {
      badge: '👰 For the Bride',
      heading: 'Gifts for Bride',
      subheading: 'Celebrate the bride-to-be with a stunning handmade crochet bouquet or a personalized gift she will love.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Bride',
    gridLabel: 'Gift ideas for bride',
    itemListName: 'Crochet Gifts for Bride',
    seoArticle: [
      {
        heading: 'Handmade Bridal Gifts',
        level: 'h2',
        paragraphs: ['Our premium crochet gifts are perfect for bridal showers, bachelorette parties, and wedding day surprises.']
      }
    ],
    relatedSlugs: ['wedding', 'for-bridesmaid', 'premium'],
  },
  {
    slug: 'for-groom',
    title: 'Gifts for Groom | Handmade Groom Gifts India',
    description: 'Discover unique handmade gifts for the groom. Custom crochet keychains, plushies, and personalized gifts. Delivered across India.',
    ogDescription: 'Discover unique handmade gifts for the groom. Custom crochet keychains, plushies, and personalized gifts.',
    hero: {
      badge: '🤵 For the Groom',
      heading: 'Gifts for Groom',
      subheading: 'Surprise the groom with a fun, personalized handmade gift that celebrates his big day.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Groom',
    gridLabel: 'Gift ideas for groom',
    itemListName: 'Crochet Gifts for Groom',
    seoArticle: [
      {
        heading: 'Fun Handmade Gifts for the Groom',
        level: 'h2',
        paragraphs: ['A personalized handmade keychain or custom plushie makes a memorable and fun gift for the groom.']
      }
    ],
    relatedSlugs: ['wedding', 'for-bride', 'for-him'],
  },
  {
    slug: 'for-bridesmaid',
    title: 'Bridesmaid Gifts | Handmade Crochet Bridesmaid Gifts India',
    description: 'Shop affordable handmade bridesmaid gifts. Cute crochet hair accessories, keychains, and return gifts for your bridal squad.',
    ogDescription: 'Shop affordable handmade bridesmaid gifts. Cute crochet hair accessories, keychains, and return gifts.',
    hero: {
      badge: '👯‍♀️ Bridesmaid Squad',
      heading: 'Bridesmaid Gifts',
      subheading: 'Thank your bridal squad with cute, matching handmade crochet gifts like hair clips and keychains.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bridesmaid Gifts',
    gridLabel: 'Bridesmaid gift ideas',
    itemListName: 'Handmade Bridesmaid Gifts',
    seoArticle: [
      {
        heading: 'Gifts for Your Bridal Party',
        level: 'h2',
        paragraphs: ['Show your appreciation to your bridesmaids with our adorable, handmade crochet accessories and gifts.']
      }
    ],
    relatedSlugs: ['for-bride', 'under-300', 'wedding'],
  },
  {
    slug: 'for-teacher',
    title: 'Handmade Gifts for Teacher | Teacher Appreciation Gifts India',
    description: 'Find thoughtful handmade gifts for teachers. Crochet flower pots, desk decor, and keychains. Perfect for teacher appreciation.',
    ogDescription: 'Find thoughtful handmade gifts for teachers. Crochet flower pots, desk decor, and keychains.',
    hero: {
      badge: '🍎 Thank You Teacher',
      heading: 'Gifts for Teacher',
      subheading: 'Show your appreciation with a handmade crochet flower pot or keychain that brightens up their desk.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Teacher',
    gridLabel: 'Teacher appreciation gifts',
    itemListName: 'Handmade Gifts for Teacher',
    seoArticle: [
      {
        heading: 'Thoughtful Teacher Appreciation Gifts',
        level: 'h2',
        paragraphs: ['A handmade crochet gift is a wonderful way to express gratitude to a teacher who has made a difference.']
      }
    ],
    relatedSlugs: ['teachers-day', 'under-500', 'housewarming'],
  },
  {
    slug: 'for-kids',
    title: 'Crochet Gifts for Kids | Handmade Toys India',
    description: 'Shop safe, handmade crochet toys and gifts for kids. Soft amigurumi plushies, cute keychains, and fun accessories. Delivered across India.',
    ogDescription: 'Shop safe, handmade crochet toys and gifts for kids. Soft amigurumi plushies and cute keychains.',
    hero: {
      badge: '🎈 For Kids',
      heading: 'Gifts for Kids',
      subheading: 'Delight the little ones with our soft, handmade amigurumi toys and fun crochet accessories.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Kids',
    gridLabel: 'Gift ideas for kids',
    itemListName: 'Crochet Gifts for Kids',
    seoArticle: [
      {
        heading: 'Safe and Fun Handmade Toys',
        level: 'h2',
        paragraphs: ['Our crochet toys are handmade with love and care, making them the perfect cuddly companion for kids of all ages.']
      }
    ],
    relatedSlugs: ['for-baby', 'birthday', 'under-500'],
  },
  {
    slug: 'for-baby',
    title: 'Crochet Gifts for Baby | Handmade Baby Gifts India',
    description: 'Find soft, handmade crochet gifts for babies. Baby-safe amigurumi plush toys, rattles, and nursery decor. Perfect baby shower gifts.',
    ogDescription: 'Find soft, handmade crochet gifts for babies. Baby-safe amigurumi plush toys and nursery decor.',
    hero: {
      badge: '🍼 For Baby',
      heading: 'Gifts for Baby',
      subheading: 'Welcome the new arrival with our adorable, baby-safe handmade crochet plush toys.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Baby',
    gridLabel: 'Gift ideas for baby',
    itemListName: 'Crochet Gifts for Baby',
    seoArticle: [
      {
        heading: 'Handmade Gifts for Little Ones',
        level: 'h2',
        paragraphs: ['Our amigurumi toys are soft, safe, and beautifully handcrafted, making them ideal gifts for babies and toddlers.']
      }
    ],
    relatedSlugs: ['baby-shower', 'for-new-mom', 'for-kids'],
  },
  {
    slug: 'for-new-mom',
    title: 'Gifts for New Mom | Handmade Crochet Gifts India',
    description: 'Celebrate the new mom with a beautiful handmade gift. Crochet flower bouquets, cute baby toys, and thoughtful gifts.',
    ogDescription: 'Celebrate the new mom with a beautiful handmade gift. Crochet flower bouquets, cute baby toys, and thoughtful gifts.',
    hero: {
      badge: '👶 New Mom',
      heading: 'Gifts for New Mom',
      subheading: 'Treat the new mom to a beautiful forever flower bouquet or a cute handmade toy for her little one.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For New Mom',
    gridLabel: 'Gift ideas for new mom',
    itemListName: 'Handmade Gifts for New Mom',
    seoArticle: [
      {
        heading: 'Thoughtful Gifts for the New Mom',
        level: 'h2',
        paragraphs: ['A handmade crochet gift is a wonderful way to congratulate and support a new mother on her journey.']
      }
    ],
    relatedSlugs: ['for-baby', 'baby-shower', 'for-wife'],
  },
  {
    slug: 'for-sister-in-law',
    title: 'Gifts for Sister in Law | Handmade Gifts India',
    description: 'Shop beautiful handmade gifts for your sister-in-law. Crochet flower bouquets, hair accessories, and elegant gifts. Delivered across India.',
    ogDescription: 'Shop beautiful handmade gifts for your sister-in-law. Crochet flower bouquets, hair accessories, and elegant gifts.',
    hero: {
      badge: '✨ Sister-in-Law',
      heading: 'Gifts for Sister-in-Law',
      subheading: 'Show your appreciation with a beautiful handmade crochet bouquet or elegant hair accessories.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Sister-in-Law',
    gridLabel: 'Gift ideas for sister in law',
    itemListName: 'Crochet Gifts for Sister in Law',
    seoArticle: [
      {
        heading: 'Elegant Handmade Gifts',
        level: 'h2',
        paragraphs: ['Our handcrafted crochet gifts are perfect for showing your sister-in-law how much she means to your family.']
      }
    ],
    relatedSlugs: ['for-sister', 'birthday', 'under-500'],
  },
  {
    slug: 'for-mother-in-law',
    title: 'Gifts for Mother in Law | Handmade Gifts India',
    description: 'Find elegant handmade gifts for your mother-in-law. Crochet flower bouquets, pot arrangements, and premium decor. Delivered across India.',
    ogDescription: 'Find elegant handmade gifts for your mother-in-law. Crochet flower bouquets, pot arrangements, and premium decor.',
    hero: {
      badge: '🌟 Mother-in-Law',
      heading: 'Gifts for Mother-in-Law',
      subheading: 'Impress her with a stunning handmade crochet flower arrangement or a premium forever bouquet.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'For Mother-in-Law',
    gridLabel: 'Gift ideas for mother in law',
    itemListName: 'Crochet Gifts for Mother in Law',
    seoArticle: [
      {
        heading: 'Premium Handmade Gifts',
        level: 'h2',
        paragraphs: ['A beautifully crafted crochet flower bouquet or pot arrangement makes a sophisticated and lasting gift for your mother-in-law.']
      }
    ],
    relatedSlugs: ['for-mom', 'premium', 'mothers-day'],
  },
  {
    slug: 'for-daughter',
    title: 'Gifts for Daughter | Handmade Crochet Gifts India',
    description: 'Shop cute handmade gifts for your daughter. Crochet plush toys, hair accessories, and flower bouquets. Perfect gifts delivered across India.',
    ogDescription: 'Shop cute handmade gifts for your daughter. Crochet plush toys, hair accessories, and flower bouquets.',
    hero: {
      badge: '🎀 For Daughter',
      heading: 'Gifts for Daughter',
      subheading: 'From cute amigurumi toys to pretty hair accessories, find the perfect handmade gift for your daughter.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'hair-accessories', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Daughter',
    gridLabel: 'Gift ideas for daughter',
    itemListName: 'Crochet Gifts for Daughter',
    seoArticle: [
      {
        heading: 'Gifts Made with Love',
        level: 'h2',
        paragraphs: ['Show your daughter how special she is with a handmade crochet gift that she can cherish for years to come.']
      }
    ],
    relatedSlugs: ['for-kids', 'birthday', 'under-500'],
  },
  {
    slug: 'for-son',
    title: 'Gifts for Son | Handmade Crochet Gifts India',
    description: 'Find fun handmade gifts for your son. Crochet character keychains, plush toys, and custom designs. Delivered across India.',
    ogDescription: 'Find fun handmade gifts for your son. Crochet character keychains, plush toys, and custom designs.',
    hero: {
      badge: '👦 For Son',
      heading: 'Gifts for Son',
      subheading: 'Surprise him with a handmade crochet plushie or a cool keychain of his favorite character.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Son',
    gridLabel: 'Gift ideas for son',
    itemListName: 'Crochet Gifts for Son',
    seoArticle: [
      {
        heading: 'Fun and Unique Gifts',
        level: 'h2',
        paragraphs: ['Our handmade crochet toys and keychains are perfect for sons of all ages, adding a touch of fun to their everyday routine.']
      }
    ],
    relatedSlugs: ['for-kids', 'birthday', 'under-500'],
  },
  {
    slug: 'for-colleague',
    title: 'Gifts for Coworkers | Handmade Office Gifts India',
    description: 'Shop thoughtful handmade gifts for coworkers. Crochet desk decor, flower pots, and keychains. Perfect office gifts delivered across India.',
    ogDescription: 'Shop thoughtful handmade gifts for coworkers. Crochet desk decor, flower pots, and keychains.',
    hero: {
      badge: '💼 For Coworker',
      heading: 'Gifts for Coworkers',
      subheading: 'Brighten up their desk with a handmade crochet flower pot or a fun keychain.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Coworker',
    gridLabel: 'Gift ideas for coworker',
    itemListName: 'Handmade Gifts for Coworkers',
    seoArticle: [
      {
        heading: 'Perfect Office Gifts',
        level: 'h2',
        paragraphs: ['Our crochet flower pots and keychains make excellent, low-maintenance gifts for colleagues and office friends.']
      }
    ],
    relatedSlugs: ['for-employee', 'housewarming', 'under-300'],
  },
  {
    slug: 'for-employee',
    title: 'Employee Gifts | Handmade Corporate Gifts India',
    description: 'Discover unique handmade employee gifts. Crochet desk accessories, keychains, and custom corporate gifts. Bulk orders available.',
    ogDescription: 'Discover unique handmade employee gifts. Crochet desk accessories, keychains, and custom corporate gifts.',
    hero: {
      badge: '🏢 Employee Appreciation',
      heading: 'Employee Gifts',
      subheading: 'Show appreciation to your team with unique, handmade crochet gifts that stand out from typical corporate swag.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Employee Gifts',
    gridLabel: 'Gift ideas for employees',
    itemListName: 'Handmade Employee Gifts',
    seoArticle: [
      {
        heading: 'Meaningful Corporate Gifting',
        level: 'h2',
        paragraphs: ['Handmade crochet gifts offer a personal touch that your employees will truly appreciate.']
      }
    ],
    relatedSlugs: ['for-colleague', 'under-300', 'under-500'],
  },
  {
    slug: 'for-female-friend',
    title: 'Gifts for Female Friend | Cute Handmade Gifts India',
    description: 'Find the cutest handmade gifts for your female friends. Crochet hair accessories, flower bouquets, and keychains. Delivered across India.',
    ogDescription: 'Find the cutest handmade gifts for your female friends. Crochet hair accessories, flower bouquets, and keychains.',
    hero: {
      badge: '👯‍♀️ Bestie',
      heading: 'Gifts for Female Friend',
      subheading: 'Treat your friends to adorable handmade crochet accessories, forever flowers, and matching keychains.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories', 'flower-bouquets', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Female Friend',
    gridLabel: 'Gift ideas for female friend',
    itemListName: 'Crochet Gifts for Female Friend',
    seoArticle: [
      {
        heading: 'Handmade Gifts for Your Girlfriends',
        level: 'h2',
        paragraphs: ['Celebrate your friendships with beautiful, handcrafted crochet pieces that they can wear or display.']
      }
    ],
    relatedSlugs: ['for-best-friend', 'friendship-day', 'under-500'],
  },
  {
    slug: 'for-male-friend',
    title: 'Gifts for Male Friend | Unique Handmade Gifts India',
    description: 'Shop unique handmade gifts for male friends. Crochet character keychains, custom plush toys, and fun gifts. Delivered across India.',
    ogDescription: 'Shop unique handmade gifts for male friends. Crochet character keychains, custom plush toys, and fun gifts.',
    hero: {
      badge: '🤜🤛 For Bro',
      heading: 'Gifts for Male Friend',
      subheading: 'Get him a unique, handmade crochet keychain or a fun plushie of his favorite character.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Male Friend',
    gridLabel: 'Gift ideas for male friend',
    itemListName: 'Crochet Gifts for Male Friend',
    seoArticle: [
      {
        heading: 'Fun Gifts for the Guys',
        level: 'h2',
        paragraphs: ['Our handmade crochet keychains and toys make great, quirky gifts for your male friends.']
      }
    ],
    relatedSlugs: ['for-best-friend', 'friendship-day', 'under-300'],
  },
  {
    slug: 'for-long-distance-couple',
    title: 'Long Distance Relationship Gifts | Couple Gifts India',
    description: 'Find thoughtful long distance relationship gifts. Handmade matching keychains, couple gifts, and custom crochet items. Delivered across India.',
    ogDescription: 'Find thoughtful long distance relationship gifts. Handmade matching keychains, couple gifts, and custom items.',
    hero: {
      badge: '✈️ Across the Miles',
      heading: 'Long Distance Relationship Gifts',
      subheading: 'Bridge the distance with matching handmade crochet keychains or a special forever gift that reminds them of you.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Long Distance Gifts',
    gridLabel: 'Long distance relationship gift ideas',
    itemListName: 'Long Distance Relationship Gifts',
    seoArticle: [
      {
        heading: 'Stay Connected with Handmade Gifts',
        level: 'h2',
        paragraphs: ['A handmade crochet gift is a tangible reminder of your love, perfect for couples navigating a long-distance relationship.']
      }
    ],
    relatedSlugs: ['for-couples', 'anniversary', 'valentines-day'],
  },

  // ═══════════════════════════════════════════
  // MORE BUDGET PAGES
  // ═══════════════════════════════════════════

  {
    slug: 'under-199',
    title: 'Gifts Under 199 | Cheap Handmade Gifts India',
    description: 'Shop affordable crochet gifts under ₹199. Cute handmade keychains and small accessories that won\'t break the bank.',
    ogDescription: 'Shop affordable crochet gifts under ₹199. Cute handmade keychains and small accessories.',
    hero: {
      badge: '💸 Pocket Friendly',
      heading: 'Gifts Under ₹199',
      subheading: 'Thoughtful handmade gifts that are easy on your wallet.',
    },
    productFilter: { type: 'price', maxPrice: 199 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹199',
    gridLabel: 'Gifts under 199',
    itemListName: 'Gifts Under 199',
    seoArticle: [
      {
        heading: 'Affordable Handmade Gifts',
        level: 'h2',
        paragraphs: ['You don\'t need to spend a lot to show someone you care. Our collection of gifts under ₹199 features adorable, handmade crochet items that make perfect little surprises.']
      }
    ],
    relatedSlugs: ['under-299', 'cheap', 'for-friend'],
  },
  {
    slug: 'under-299',
    title: 'Gifts Under 299 | Affordable Handmade Gifts India',
    description: 'Discover cute crochet gifts under ₹299. Perfect for return gifts, small surprises, and budget-friendly presents.',
    ogDescription: 'Discover cute crochet gifts under ₹299. Perfect for return gifts and small surprises.',
    hero: {
      badge: '💸 Pocket Friendly',
      heading: 'Gifts Under ₹299',
      subheading: 'Beautiful handmade gifts that fit perfectly in your budget.',
    },
    productFilter: { type: 'price', maxPrice: 299 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹299',
    gridLabel: 'Gifts under 299',
    itemListName: 'Gifts Under 299',
    seoArticle: [
      {
        heading: 'Great Gifts on a Budget',
        level: 'h2',
        paragraphs: ['Find the perfect handmade gift without breaking the bank. Our under ₹299 collection includes cute keychains, hair accessories, and more.']
      }
    ],
    relatedSlugs: ['under-199', 'under-399', 'affordable'],
  },
  {
    slug: 'under-399',
    title: 'Gifts Under 399 | Affordable Crochet Gifts India',
    description: 'Shop handmade crochet gifts under ₹399. High-quality, affordable presents for friends, family, and colleagues.',
    ogDescription: 'Shop handmade crochet gifts under ₹399. High-quality, affordable presents.',
    hero: {
      badge: '💝 Great Value',
      heading: 'Gifts Under ₹399',
      subheading: 'Find beautiful, handmade crochet gifts that are both affordable and memorable.',
    },
    productFilter: { type: 'price', maxPrice: 399 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹399',
    gridLabel: 'Gifts under 399',
    itemListName: 'Gifts Under 399',
    seoArticle: [
      {
        heading: 'Handmade Gifts Under 399',
        level: 'h2',
        paragraphs: ['Explore our range of beautiful crochet gifts under ₹399. Perfect for birthdays, return gifts, or just because.']
      }
    ],
    relatedSlugs: ['under-299', 'under-499', 'value-gifts'],
  },
  {
    slug: 'under-499',
    title: 'Gifts Under 499 | Handmade Gifts Under 500 India',
    description: 'Find amazing handmade gifts under ₹499. Crochet plushies, beautiful accessories, and thoughtful presents for any occasion.',
    ogDescription: 'Find amazing handmade gifts under ₹499. Crochet plushies, beautiful accessories, and more.',
    hero: {
      badge: '💝 Great Value',
      heading: 'Gifts Under ₹499',
      subheading: 'Shop our popular collection of handmade crochet gifts, all perfectly priced under ₹499.',
    },
    productFilter: { type: 'price', maxPrice: 499 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹499',
    gridLabel: 'Gifts under 499',
    itemListName: 'Gifts Under 499',
    seoArticle: [
      {
        heading: 'Premium Gifts on a Budget',
        level: 'h2',
        paragraphs: ['Get the best of handmade craftsmanship without overspending. Our under ₹499 collection features some of our most loved crochet items, proving you don\'t need a massive budget to give a deeply meaningful gift.']
      },
      {
        heading: 'Shop By Budget Tier',
        level: 'h3',
        bullets: [
          { text: 'Best Gifts Under ₹199 - Perfect for small surprises', href: '/gifts/under-199' },
          { text: 'Best Gifts ₹200–₹299 - Ideal for return gifts', href: '/gifts/under-299' },
          { text: 'Best Gifts ₹300–₹499 - Premium amigurumi and keychains', href: '/gifts/under-499' }
        ]
      },
      {
        heading: 'Find Affordable Gifts For Them',
        level: 'h3',
        bullets: [
          { text: 'Small Surprises for Girlfriend', href: '/gifts/for-girlfriend' },
          { text: 'Cool Gifts for Boyfriend', href: '/gifts/for-boyfriend' },
          { text: 'Thoughtful Gifts for Mom', href: '/gifts/for-mom' },
          { text: 'Matching Gifts for Best Friend', href: '/gifts/for-best-friend' }
        ]
      },
      {
        heading: 'Shop By Occasion',
        level: 'h3',
        bullets: [
          { text: 'Affordable Birthday Gifts', href: '/gifts/birthday' },
          { text: 'Budget Valentine\'s Surprises', href: '/gifts/valentines-day' },
          { text: 'Friendship Day Tokens', href: '/gifts/friendship-day' }
        ]
      }
    ],
    relatedSlugs: ['under-599', 'under-500', 'affordable'],
  },
  {
    slug: 'under-599',
    title: 'Gifts Under 599 | Cute Handmade Gifts India',
    description: 'Shop premium crochet gifts under ₹599. Beautiful handmade presents, amigurumi toys, and accessories.',
    ogDescription: 'Shop premium crochet gifts under ₹599. Beautiful handmade presents and toys.',
    hero: {
      badge: '🎁 Perfect Present',
      heading: 'Gifts Under ₹599',
      subheading: 'Discover unique handmade crochet gifts that hit the sweet spot between premium quality and affordability.',
    },
    productFilter: { type: 'price', maxPrice: 599 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹599',
    gridLabel: 'Gifts under 599',
    itemListName: 'Gifts Under 599',
    seoArticle: [
      {
        heading: 'Beautiful Gifts Under 599',
        level: 'h2',
        paragraphs: ['Find the perfect mid-range gift for your loved ones. Our under ₹599 selection includes detailed crochet toys and beautiful accessories.']
      }
    ],
    relatedSlugs: ['under-499', 'under-799', 'value-gifts'],
  },
  {
    slug: 'under-799',
    title: 'Gifts Under 799 | Premium Crochet Gifts India',
    description: 'Find stunning handmade gifts under ₹799. Detailed crochet plushies, small flower bouquets, and beautiful home decor.',
    ogDescription: 'Find stunning handmade gifts under ₹799. Detailed crochet plushies and flower bouquets.',
    hero: {
      badge: '✨ Premium Quality',
      heading: 'Gifts Under ₹799',
      subheading: 'Shop beautifully crafted handmade gifts that make a lasting impression.',
    },
    productFilter: { type: 'price', maxPrice: 799 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹799',
    gridLabel: 'Gifts under 799',
    itemListName: 'Gifts Under 799',
    seoArticle: [
      {
        heading: 'Premium Handmade Gifts',
        level: 'h2',
        paragraphs: ['Treat someone special to a premium handmade gift. Our under ₹799 collection features intricate crochet designs that they will cherish.']
      }
    ],
    relatedSlugs: ['under-599', 'under-999', 'premium'],
  },
  {
    slug: 'under-999',
    title: 'Gifts Under 999 | Handmade Gifts Under 1000 India',
    description: 'Discover luxury handmade gifts under ₹999. Premium crochet flower bouquets, large amigurumi toys, and beautiful decor.',
    ogDescription: 'Discover luxury handmade gifts under ₹999. Premium crochet flower bouquets and large amigurumi toys.',
    hero: {
      badge: '🎀 Luxury Gifts',
      heading: 'Gifts Under ₹999',
      subheading: 'Make a statement with our premium handmade crochet gifts, all perfectly priced under ₹999.',
    },
    productFilter: { type: 'price', maxPrice: 999 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹999',
    gridLabel: 'Gifts under 999',
    itemListName: 'Gifts Under 999',
    seoArticle: [
      {
        heading: 'Luxury Gifts on a Budget',
        level: 'h2',
        paragraphs: ['You don\'t have to spend thousands to give a luxurious gift. Our under ₹999 collection features our most popular premium crochet items.']
      }
    ],
    relatedSlugs: ['under-799', 'under-1499', 'premium'],
  },
  {
    slug: 'under-1499',
    title: 'Gifts Under 1499 | Premium Handmade Gifts India',
    description: 'Shop exclusive handmade gifts under ₹1499. Large crochet flower arrangements, custom plushies, and luxury gifts.',
    ogDescription: 'Shop exclusive handmade gifts under ₹1499. Large crochet flower arrangements and custom plushies.',
    hero: {
      badge: '🌟 Exclusive Gifts',
      heading: 'Gifts Under ₹1499',
      subheading: 'Find the perfect premium handmade gift for that special someone or milestone occasion.',
    },
    productFilter: { type: 'price', maxPrice: 1499 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹1499',
    gridLabel: 'Gifts under 1499',
    itemListName: 'Gifts Under 1499',
    seoArticle: [
      {
        heading: 'Exclusive Handmade Gifts',
        level: 'h2',
        paragraphs: ['Our premium collection under ₹1499 features large, intricate crochet designs that make unforgettable gifts for anniversaries and birthdays.']
      }
    ],
    relatedSlugs: ['under-999', 'under-1999', 'premium'],
  },
  {
    slug: 'under-1999',
    title: 'Gifts Under 1999 | Premium Crochet Gifts India',
    description: 'Discover ultimate premium handmade gifts under ₹1999. Massive crochet bouquets, detailed amigurumi, and luxurious presents.',
    ogDescription: 'Discover ultimate premium handmade gifts under ₹1999. Massive crochet bouquets and detailed amigurumi.',
    hero: {
      badge: '👑 Ultimate Luxury',
      heading: 'Gifts Under ₹1999',
      subheading: 'For when you want to go all out. Shop our most luxurious handmade crochet gifts.',
    },
    productFilter: { type: 'price', maxPrice: 1999 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹1999',
    gridLabel: 'Gifts under 1999',
    itemListName: 'Gifts Under 1999',
    seoArticle: [
      {
        heading: 'The Ultimate Handmade Gifts',
        level: 'h2',
        paragraphs: ['Make a grand gesture with our most premium crochet gifts. These show-stopping pieces are perfect for the most important occasions.']
      }
    ],
    relatedSlugs: ['under-1499', 'under-2999', 'premium'],
  },
  {
    slug: 'under-2999',
    title: 'Gifts Under 2999 | Luxury Handmade Gifts India',
    description: 'Shop luxury handmade crochet gifts under ₹2999. The finest craftsmanship, giant bouquets, and heirloom quality toys.',
    ogDescription: 'Shop luxury handmade crochet gifts under ₹2999. The finest craftsmanship and heirloom quality toys.',
    hero: {
      badge: '💎 The Finest Collection',
      heading: 'Gifts Under ₹2999',
      subheading: 'Our most exquisite, time-intensive handmade creations for those truly unforgettable moments.',
    },
    productFilter: { type: 'price', maxPrice: 2999 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Under ₹2999',
    gridLabel: 'Gifts under 2999',
    itemListName: 'Gifts Under 2999',
    seoArticle: [
      {
        heading: 'Uncompromising Quality and Luxury',
        level: 'h2',
        paragraphs: ['For the ultimate luxury gift, explore our collection under ₹2999. These pieces represent hours of dedicated craftsmanship and the finest materials.']
      }
    ],
    relatedSlugs: ['under-1999', 'premium', 'anniversary'],
  },
  {
    slug: 'cheap',
    title: 'Cheap Handmade Gifts | Affordable Crochet Gifts India',
    description: 'Find cheap but beautiful handmade gifts. Affordable crochet keychains, accessories, and return gifts that fit any budget.',
    ogDescription: 'Find cheap but beautiful handmade gifts. Affordable crochet keychains, accessories, and return gifts.',
    hero: {
      badge: '💸 Budget Friendly',
      heading: 'Cheap & Affordable Gifts',
      subheading: 'Who says handmade has to be expensive? Discover our collection of budget-friendly crochet gifts.',
    },
    productFilter: { type: 'price', maxPrice: 300 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Cheap Gifts',
    gridLabel: 'Cheap handmade gifts',
    itemListName: 'Cheap Handmade Gifts',
    seoArticle: [
      {
        heading: 'Affordable Doesn\'t Mean Low Quality',
        level: 'h2',
        paragraphs: ['Our affordable range of crochet gifts is made with the same love and care as our premium items, just in smaller, budget-friendly packages.']
      }
    ],
    relatedSlugs: ['under-199', 'under-299', 'value-gifts'],
  },
  {
    slug: 'affordable',
    title: 'Affordable Gifts India | Low Budget Handmade Gifts',
    description: 'Shop affordable handmade gifts online in India. Beautiful crochet gifts that won\'t break the bank. Perfect for every occasion.',
    ogDescription: 'Shop affordable handmade gifts online in India. Beautiful crochet gifts that won\'t break the bank.',
    hero: {
      badge: '💝 Smart Gifting',
      heading: 'Affordable Gifts',
      subheading: 'Thoughtful, handmade presents that show you care, without stretching your budget.',
    },
    productFilter: { type: 'price', maxPrice: 400 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Affordable Gifts',
    gridLabel: 'Affordable gift ideas',
    itemListName: 'Affordable Handmade Gifts',
    seoArticle: [
      {
        heading: 'Smart and Thoughtful Gifting',
        level: 'h2',
        paragraphs: ['Finding the right gift on a budget is easy with our collection of affordable handmade crochet items.']
      }
    ],
    relatedSlugs: ['cheap', 'under-399', 'value-gifts'],
  },
  {
    slug: 'value-gifts',
    title: 'Value Gifts | Affordable Unique Handmade Gifts India',
    description: 'Discover the best value handmade gifts. High-quality crochet items that offer incredible value for money. Shop online in India.',
    ogDescription: 'Discover the best value handmade gifts. High-quality crochet items that offer incredible value for money.',
    hero: {
      badge: '⭐ Best Value',
      heading: 'Value Gifts',
      subheading: 'Get the most for your money with these beautifully crafted, highly-rated handmade gifts.',
    },
    productFilter: { type: 'price', maxPrice: 600, minPrice: 200 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Value Gifts',
    gridLabel: 'Best value gifts',
    itemListName: 'Value Handmade Gifts',
    seoArticle: [
      {
        heading: 'Incredible Value for Money',
        level: 'h2',
        paragraphs: ['We\'ve curated a selection of handmade gifts that offer the perfect balance of price and premium quality craftsmanship.']
      }
    ],
    relatedSlugs: ['affordable', 'under-499', 'under-599'],
  },
  {
    slug: 'under-500-for-girlfriend',
    title: 'Gifts Under 500 for Girlfriend | Romantic Handmade Gifts',
    description: 'Find romantic handmade gifts under ₹500 for your girlfriend. Cute crochet keychains, accessories, and thoughtful surprises.',
    ogDescription: 'Find romantic handmade gifts under ₹500 for your girlfriend. Cute crochet keychains, accessories, and more.',
    hero: {
      badge: '❤️ For Her',
      heading: 'Gifts Under ₹500 for Girlfriend',
      subheading: 'Surprise her with a thoughtful handmade gift that she\'ll love, perfectly priced under ₹500.',
    },
    productFilter: { type: 'combo', slugs: ['keychains', 'hair-accessories', 'flower-bouquets'], maxPrice: 500 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹500 for Girlfriend',
    gridLabel: 'Gifts under 500 for girlfriend',
    itemListName: 'Gifts Under 500 for Girlfriend',
    seoArticle: [
      {
        heading: 'Romantic Gifts on a Budget',
        level: 'h2',
        paragraphs: ['Show your girlfriend how much you care with a cute, handmade crochet gift that fits perfectly within your budget.']
      }
    ],
    relatedSlugs: ['for-girlfriend', 'under-499', 'under-1000-for-girlfriend'],
  },
  {
    slug: 'under-1000-for-girlfriend',
    title: 'Gifts Under 1000 for Girlfriend | Premium Romantic Gifts',
    description: 'Shop beautiful romantic gifts under ₹1000 for your girlfriend. Premium crochet flower bouquets and adorable plushies.',
    ogDescription: 'Shop beautiful romantic gifts under ₹1000 for your girlfriend. Premium crochet flower bouquets and plushies.',
    hero: {
      badge: '💝 Premium Love',
      heading: 'Gifts Under ₹1000 for Girlfriend',
      subheading: 'Make her day with a premium handmade crochet bouquet or cute plushie, all under ₹1000.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets', 'toys', 'hair-accessories'], maxPrice: 1000 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Under ₹1000 for Girlfriend',
    gridLabel: 'Gifts under 1000 for girlfriend',
    itemListName: 'Gifts Under 1000 for Girlfriend',
    seoArticle: [
      {
        heading: 'Make a Lasting Impression',
        level: 'h2',
        paragraphs: ['Our collection of handmade gifts under ₹1000 features stunning crochet bouquets that will last forever, just like your love.']
      }
    ],
    relatedSlugs: ['for-girlfriend', 'under-999', 'under-500-for-girlfriend'],
  },
  {
    slug: 'under-500-for-boyfriend',
    title: 'Gifts Under 500 for Boyfriend | Cute Handmade Gifts',
    description: 'Find fun handmade gifts under ₹500 for your boyfriend. Unique crochet keychains and small accessories he\'ll actually use.',
    ogDescription: 'Find fun handmade gifts under ₹500 for your boyfriend. Unique crochet keychains and small accessories.',
    hero: {
      badge: '🧔 For Him',
      heading: 'Gifts Under ₹500 for Boyfriend',
      subheading: 'Get him a unique, personalized handmade gift that he\'ll love showing off.',
    },
    productFilter: { type: 'combo', slugs: ['keychains', 'toys'], maxPrice: 500 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹500 for Boyfriend',
    gridLabel: 'Gifts under 500 for boyfriend',
    itemListName: 'Gifts Under 500 for Boyfriend',
    seoArticle: [
      {
        heading: 'Unique Gifts He Will Love',
        level: 'h2',
        paragraphs: ['Skip the boring gifts and get him a handmade crochet keychain of his favorite character or interest, all under ₹500.']
      }
    ],
    relatedSlugs: ['for-boyfriend', 'under-499', 'under-500'],
  },
  {
    slug: 'under-500-for-friend',
    title: 'Gifts Under 500 for Friend | Affordable Friendship Gifts',
    description: 'Shop thoughtful friendship gifts under ₹500. Cute handmade crochet keychains, desk accessories, and plushies.',
    ogDescription: 'Shop thoughtful friendship gifts under ₹500. Cute handmade crochet keychains, desk accessories, and plushies.',
    hero: {
      badge: '💛 Bestie on a Budget',
      heading: 'Gifts Under ₹500 for Friend',
      subheading: 'Celebrate your friendship with adorable, affordable handmade crochet gifts.',
    },
    productFilter: { type: 'combo', slugs: ['keychains', 'toys', 'hair-accessories'], maxPrice: 500 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹500 for Friend',
    gridLabel: 'Gifts under 500 for friend',
    itemListName: 'Gifts Under 500 for Friend',
    seoArticle: [
      {
        heading: 'Affordable Gifts for Friends',
        level: 'h2',
        paragraphs: ['A handmade crochet gift is a thoughtful way to show your friend you care without spending too much.']
      }
    ],
    relatedSlugs: ['for-friend', 'for-best-friend', 'cheap'],
  },
  {
    slug: 'under-500-for-mom',
    title: 'Gifts Under 500 for Mom | Thoughtful Mother\'s Gifts',
    description: 'Find beautiful handmade gifts under ₹500 for mom. Small crochet flower pots, elegant keychains, and thoughtful surprises.',
    ogDescription: 'Find beautiful handmade gifts under ₹500 for mom. Small crochet flower pots, elegant keychains, and more.',
    hero: {
      badge: '🌸 For Mom',
      heading: 'Gifts Under ₹500 for Mom',
      subheading: 'Show her your appreciation with a beautiful, handmade crochet gift that she can cherish.',
    },
    productFilter: { type: 'combo', slugs: ['flower-pots', 'keychains', 'hair-accessories'], maxPrice: 500 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Under ₹500 for Mom',
    gridLabel: 'Gifts under 500 for mom',
    itemListName: 'Gifts Under 500 for Mom',
    seoArticle: [
      {
        heading: 'Thoughtful Gifts She Will Love',
        level: 'h2',
        paragraphs: ['Our collection of handmade gifts under ₹500 features beautiful items that will bring a smile to your mother\'s face.']
      }
    ],
    relatedSlugs: ['for-mom', 'mothers-day', 'under-499'],
  },

  // ═══════════════════════════════════════════
  // MORE OCCASION PAGES
  // ═══════════════════════════════════════════

  {
    slug: 'bhai-dooj',
    title: 'Bhai Dooj Gifts | Handmade Gifts for Brother & Sister',
    description: 'Celebrate Bhai Dooj with handmade crochet gifts. Unique keychains, small toys, and personalized gifts for brothers and sisters.',
    ogDescription: 'Celebrate Bhai Dooj with handmade crochet gifts. Unique keychains, small toys, and personalized gifts.',
    hero: {
      badge: '🌸 Festive Gifting',
      heading: 'Bhai Dooj Gifts',
      subheading: 'Show your sibling love with a unique, handmade crochet gift they\'ll cherish.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bhai Dooj Gifts',
    gridLabel: 'Bhai Dooj gift ideas',
    itemListName: 'Bhai Dooj Gifts',
    seoArticle: [
      {
        heading: 'Unique Handmade Bhai Dooj Gifts',
        level: 'h2',
        paragraphs: ['Skip the traditional sweets and gift something lasting this Bhai Dooj. Our handmade crochet items make the perfect, memorable present for your brother or sister.']
      }
    ],
    relatedSlugs: ['raksha-bandhan', 'for-brother', 'for-sister'],
  },
  {
    slug: 'womens-day',
    title: 'Women\'s Day Gifts | Handmade Gifts for Women',
    description: 'Celebrate Women\'s Day with beautiful handmade crochet gifts. Premium flower bouquets, accessories, and thoughtful gifts for her.',
    ogDescription: 'Celebrate Women\'s Day with beautiful handmade crochet gifts. Premium flower bouquets, accessories, and more.',
    hero: {
      badge: '💜 Happy Women\'s Day',
      heading: 'Women\'s Day Gifts',
      subheading: 'Honor the women in your life with beautifully crafted handmade gifts.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Women\'s Day Gifts',
    gridLabel: 'Women\'s Day gift ideas',
    itemListName: 'Women\'s Day Gifts',
    seoArticle: [
      {
        heading: 'Celebrate Her with Handmade Gifts',
        level: 'h2',
        paragraphs: ['This Women\'s Day, show your appreciation with a gift that required time, skill, and care to create—a beautiful crochet piece.']
      }
    ],
    relatedSlugs: ['for-her', 'mothers-day', 'for-wife'],
  },
  {
    slug: 'childrens-day',
    title: 'Children\'s Day Gifts | Handmade Toys for Kids',
    description: 'Shop Children\'s Day gifts online. Safe, handmade amigurumi crochet toys, keychains, and cute plushies for kids.',
    ogDescription: 'Shop Children\'s Day gifts online. Safe, handmade amigurumi crochet toys, keychains, and cute plushies.',
    hero: {
      badge: '🎈 Happy Children\'s Day',
      heading: 'Children\'s Day Gifts',
      subheading: 'Delight them with a soft, cuddly handmade toy made just for them.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Children\'s Day Gifts',
    gridLabel: 'Children\'s Day gift ideas',
    itemListName: 'Children\'s Day Gifts',
    seoArticle: [
      {
        heading: 'Safe and Adorable Gifts for Kids',
        level: 'h2',
        paragraphs: ['Our handmade crochet toys are crafted with child-friendly yarn, making them the perfect companion for Children\'s Day.']
      }
    ],
    relatedSlugs: ['for-kids', 'for-son', 'for-daughter'],
  },
  {
    slug: 'diwali',
    title: 'Diwali Gifts | Unique Handmade Diwali Gifts India',
    description: 'Discover unique handmade Diwali gifts. Crochet home decor, flower pots, and thoughtful festive presents delivered across India.',
    ogDescription: 'Discover unique handmade Diwali gifts. Crochet home decor, flower pots, and thoughtful festive presents.',
    hero: {
      badge: '🪔 Festive Gifting',
      heading: 'Diwali Gifts',
      subheading: 'Light up their Diwali with a beautiful, handmade crochet gift that adds warmth to their home.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Diwali Gifts',
    gridLabel: 'Diwali gift ideas',
    itemListName: 'Diwali Gifts',
    seoArticle: [
      {
        heading: 'Handmade Gifts for the Festive Season',
        level: 'h2',
        paragraphs: ['Move beyond typical Diwali sweets. Gift a beautiful crochet flower pot that will stay fresh and vibrant in their home all year round.']
      }
    ],
    relatedSlugs: ['housewarming', 'premium', 'wedding-return-gifts'],
  },
  {
    slug: 'christmas',
    title: 'Christmas Gifts | Handmade Christmas Gifts & Decor',
    description: 'Shop handmade Christmas gifts and crochet decor. Unique amigurumi toys, ornaments, and holiday presents.',
    ogDescription: 'Shop handmade Christmas gifts and crochet decor. Unique amigurumi toys, ornaments, and holiday presents.',
    hero: {
      badge: '🎄 Merry Christmas',
      heading: 'Christmas Gifts',
      subheading: 'Spread holiday cheer with adorable, handcrafted crochet gifts and festive decor.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Christmas Gifts',
    gridLabel: 'Christmas gift ideas',
    itemListName: 'Christmas Gifts',
    seoArticle: [
      {
        heading: 'Cozy Handmade Christmas Gifts',
        level: 'h2',
        paragraphs: ['Nothing says \'cozy\' like handmade crochet. Find the perfect Christmas present or stocking stuffer for your loved ones.']
      }
    ],
    relatedSlugs: ['for-kids', 'under-500', 'for-friend'],
  },
  {
    slug: 'holi',
    title: 'Holi Gifts | Unique Handmade Festive Gifts',
    description: 'Find unique handmade gifts for Holi. Colorful crochet accessories and fun presents to celebrate the festival of colors.',
    ogDescription: 'Find unique handmade gifts for Holi. Colorful crochet accessories and fun presents.',
    hero: {
      badge: '🎨 Festive Colors',
      heading: 'Holi Gifts',
      subheading: 'Celebrate the festival of colors with bright, vibrant handmade crochet gifts.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Holi Gifts',
    gridLabel: 'Holi gift ideas',
    itemListName: 'Holi Gifts',
    seoArticle: [
      {
        heading: 'Colorful Gifts for Holi',
        level: 'h2',
        paragraphs: ['Add a pop of lasting color to someone\'s day with our bright, beautiful crochet hair accessories and keychains.']
      }
    ],
    relatedSlugs: ['under-300', 'cheap', 'for-friend'],
  },
  {
    slug: 'karwa-chauth',
    title: 'Karwa Chauth Gifts | Romantic Handmade Gifts for Wife',
    description: 'Shop romantic Karwa Chauth gifts for your wife. Premium handmade crochet flower bouquets and thoughtful surprises.',
    ogDescription: 'Shop romantic Karwa Chauth gifts for your wife. Premium handmade crochet flower bouquets and thoughtful surprises.',
    hero: {
      badge: '❤️ For Your Wife',
      heading: 'Karwa Chauth Gifts',
      subheading: 'Surprise her with a premium, forever-lasting crochet bouquet on this special day.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets', 'hair-accessories'], minPrice: 500 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Karwa Chauth Gifts',
    gridLabel: 'Karwa Chauth gift ideas',
    itemListName: 'Karwa Chauth Gifts',
    seoArticle: [
      {
        heading: 'A Forever Gift for Your Wife',
        level: 'h2',
        paragraphs: ['Show your appreciation and love with a beautiful handmade crochet bouquet that will never wilt, just like your bond.']
      }
    ],
    relatedSlugs: ['for-wife', 'anniversary', 'premium'],
  },
  {
    slug: 'wedding-return-gifts',
    title: 'Wedding Return Gifts | Bulk Handmade Gifts India',
    description: 'Order unique handmade wedding return gifts in bulk. Custom crochet keychains, accessories, and small tokens of appreciation.',
    ogDescription: 'Order unique handmade wedding return gifts in bulk. Custom crochet keychains, accessories, and small tokens of appreciation.',
    hero: {
      badge: '🎀 Bulk Gifting',
      heading: 'Wedding Return Gifts',
      subheading: 'Thank your guests with a memorable, handcrafted keepsake they will actually use.',
    },
    productFilter: { type: 'combo', slugs: ['keychains', 'hair-accessories', 'flower-pots'], maxPrice: 600 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Return Gifts',
    gridLabel: 'Wedding return gift ideas',
    itemListName: 'Wedding Return Gifts',
    seoArticle: [
      {
        heading: 'Memorable Return Gifts',
        level: 'h2',
        paragraphs: ['Give your wedding guests a return gift that stands out. Our handmade crochet keychains and mini accessories are perfect bulk gifts.']
      }
    ],
    relatedSlugs: ['wedding', 'under-300', 'affordable'],
  },
  {
    slug: 'naming-ceremony',
    title: 'Naming Ceremony Gifts | Handmade Baby Gifts',
    description: 'Find beautiful handmade gifts for a baby naming ceremony. Safe crochet amigurumi toys and nursery decor.',
    ogDescription: 'Find beautiful handmade gifts for a baby naming ceremony. Safe crochet amigurumi toys and nursery decor.',
    hero: {
      badge: '🍼 Welcome Baby',
      heading: 'Naming Ceremony Gifts',
      subheading: 'Celebrate the newest family member with a soft, safe, and adorable handmade crochet toy.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Naming Ceremony Gifts',
    gridLabel: 'Naming ceremony gift ideas',
    itemListName: 'Naming Ceremony Gifts',
    seoArticle: [
      {
        heading: 'Perfect Gifts for the Little One',
        level: 'h2',
        paragraphs: ['Our amigurumi crochet toys are handmade with love, making them a safe and thoughtful gift for a baby\'s naming ceremony.']
      }
    ],
    relatedSlugs: ['baby-shower', 'for-baby', 'for-new-mom'],
  },
  {
    slug: 'farewell',
    title: 'Farewell Gifts | Thoughtful Goodbye Gifts for Colleagues',
    description: 'Shop thoughtful farewell gifts for colleagues and friends. Handmade crochet desk decor, keychains, and memory gifts.',
    ogDescription: 'Shop thoughtful farewell gifts for colleagues and friends. Handmade crochet desk decor, keychains, and memory gifts.',
    hero: {
      badge: '👋 We\'ll Miss You',
      heading: 'Farewell Gifts',
      subheading: 'Send them off with a smile and a handmade keepsake they can take on their next adventure.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Farewell Gifts',
    gridLabel: 'Farewell gift ideas',
    itemListName: 'Farewell Gifts',
    seoArticle: [
      {
        heading: 'Meaningful Goodbye Gifts',
        level: 'h2',
        paragraphs: ['A handmade crochet desk plant or personalized keychain is the perfect way to bid farewell to a favorite colleague or friend.']
      }
    ],
    relatedSlugs: ['for-colleague', 'new-job', 'under-500'],
  },
  {
    slug: 'retirement',
    title: 'Retirement Gifts | Unique Handmade Gifts',
    description: 'Discover unique retirement gifts. Handcrafted crochet flower bouquets and elegant decor for their new relaxed lifestyle.',
    ogDescription: 'Discover unique retirement gifts. Handcrafted crochet flower bouquets and elegant decor.',
    hero: {
      badge: '🌴 Happy Retirement',
      heading: 'Retirement Gifts',
      subheading: 'Celebrate their milestone with a premium, lasting handmade gift.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Retirement Gifts',
    gridLabel: 'Retirement gift ideas',
    itemListName: 'Retirement Gifts',
    seoArticle: [
      {
        heading: 'Celebrate Their New Chapter',
        level: 'h2',
        paragraphs: ['A beautiful, maintenance-free crochet flower arrangement is the perfect gift to brighten their home in retirement.']
      }
    ],
    relatedSlugs: ['farewell', 'premium', 'for-coworker'],
  },
  {
    slug: 'new-job',
    title: 'New Job Gifts | Congratulations Gifts',
    description: 'Find the perfect new job congratulations gift. Handmade crochet desk accessories, flower pots, and fun keychains.',
    ogDescription: 'Find the perfect new job congratulations gift. Handmade crochet desk accessories, flower pots, and fun keychains.',
    hero: {
      badge: '🎉 Congratulations',
      heading: 'New Job Gifts',
      subheading: 'Help them celebrate their new role with a handmade accessory for their new desk or commute.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'New Job Gifts',
    gridLabel: 'New job gift ideas',
    itemListName: 'New Job Gifts',
    seoArticle: [
      {
        heading: 'Gifts for the New Desk',
        level: 'h2',
        paragraphs: ['Our small crochet flower pots make excellent, zero-maintenance desk companions for someone starting a new job.']
      }
    ],
    relatedSlugs: ['promotion', 'for-friend', 'under-500'],
  },
  {
    slug: 'promotion',
    title: 'Promotion Gifts | Congratulations Handmade Gifts',
    description: 'Shop thoughtful gifts to celebrate a promotion. Premium crochet desk decor and beautiful flower arrangements.',
    ogDescription: 'Shop thoughtful gifts to celebrate a promotion. Premium crochet desk decor and beautiful flower arrangements.',
    hero: {
      badge: '⭐ Well Deserved',
      heading: 'Promotion Gifts',
      subheading: 'Mark their career milestone with a premium, handmade congratulatory gift.',
    },
    productFilter: { type: 'combo', slugs: ['flower-pots', 'flower-bouquets'], minPrice: 400 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Promotion Gifts',
    gridLabel: 'Promotion gift ideas',
    itemListName: 'Promotion Gifts',
    seoArticle: [
      {
        heading: 'Celebrate Their Success',
        level: 'h2',
        paragraphs: ['A premium handmade crochet gift is a thoughtful way to acknowledge their hard work and career progression.']
      }
    ],
    relatedSlugs: ['new-job', 'premium', 'for-colleague'],
  },
  {
    slug: 'get-well-soon',
    title: 'Get Well Soon Gifts | Comforting Handmade Gifts',
    description: 'Send comforting get well soon gifts. Soft crochet amigurumi plushies and cheerful forever flowers to brighten their day.',
    ogDescription: 'Send comforting get well soon gifts. Soft crochet amigurumi plushies and cheerful forever flowers.',
    hero: {
      badge: '🌻 Feel Better',
      heading: 'Get Well Soon Gifts',
      subheading: 'Brighten their recovery with a cheerful crochet flower or a cuddly handmade plushie.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'flower-bouquets', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Get Well Soon Gifts',
    gridLabel: 'Get well soon gift ideas',
    itemListName: 'Get Well Soon Gifts',
    seoArticle: [
      {
        heading: 'Comforting Handmade Gifts',
        level: 'h2',
        paragraphs: ['Unlike real flowers that wilt, our crochet bouquets stay vibrant and cheerful throughout their recovery and beyond.']
      }
    ],
    relatedSlugs: ['just-because', 'sympathy', 'for-friend'],
  },
  {
    slug: 'sympathy',
    title: 'Sympathy Gifts | Thoughtful Handmade Gifts',
    description: 'Send thoughtful sympathy gifts. Subtle, beautiful crochet flower arrangements and comforting keepsakes.',
    ogDescription: 'Send thoughtful sympathy gifts. Subtle, beautiful crochet flower arrangements and comforting keepsakes.',
    hero: {
      badge: '🤍 Thinking of You',
      heading: 'Sympathy Gifts',
      subheading: 'Express your condolences with a lasting, thoughtful handmade keepsake.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Sympathy Gifts',
    gridLabel: 'Sympathy gift ideas',
    itemListName: 'Sympathy Gifts',
    seoArticle: [
      {
        heading: 'A Lasting Token of Comfort',
        level: 'h2',
        paragraphs: ['A subtle, handmade crochet flower arrangement provides a gentle, lasting reminder that you are thinking of them during a difficult time.']
      }
    ],
    relatedSlugs: ['get-well-soon', 'just-because'],
  },
  {
    slug: 'just-because',
    title: 'Just Because Gifts | Surprise Handmade Gifts',
    description: 'Find the perfect \'just because\' gifts. Cute handmade crochet keychains, mini plushies, and spontaneous surprises.',
    ogDescription: 'Find the perfect \'just because\' gifts. Cute handmade crochet keychains, mini plushies, and spontaneous surprises.',
    hero: {
      badge: '✨ Just Because',
      heading: 'Just Because Gifts',
      subheading: 'You don\'t need an occasion to make someone smile. Surprise them with a cute handmade crochet gift.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'hair-accessories', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Just Because',
    gridLabel: 'Just because gift ideas',
    itemListName: 'Just Because Gifts',
    seoArticle: [
      {
        heading: 'Spontaneous Gifting',
        level: 'h2',
        paragraphs: ['Sometimes the best gifts are the ones given for no reason at all. Our small, affordable crochet items are perfect for a spontaneous surprise.']
      }
    ],
    relatedSlugs: ['under-299', 'cheap', 'for-friend'],
  },
  {
    slug: 'first-anniversary',
    title: '1st Anniversary Gifts | Romantic Handmade Gifts',
    description: 'Celebrate your first anniversary with a romantic handmade gift. Premium crochet flower bouquets and couple keepsakes.',
    ogDescription: 'Celebrate your first anniversary with a romantic handmade gift. Premium crochet flower bouquets and couple keepsakes.',
    hero: {
      badge: '❤️ 1st Anniversary',
      heading: 'First Anniversary Gifts',
      subheading: 'Mark your first year together with a stunning, forever-lasting handmade crochet bouquet.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets', 'keychains'], minPrice: 400 },
    orderBy: 'price_desc',
    breadcrumbLabel: '1st Anniversary',
    gridLabel: '1st anniversary gift ideas',
    itemListName: '1st Anniversary Gifts',
    seoArticle: [
      {
        heading: 'Paper and Yarn for the 1st Year',
        level: 'h2',
        paragraphs: ['A beautifully handcrafted crochet flower bouquet is a unique, lasting way to celebrate your first 365 days together.']
      }
    ],
    relatedSlugs: ['anniversary', 'for-wife', 'for-husband'],
  },
  {
    slug: 'second-anniversary',
    title: '2nd Anniversary Gifts | Unique Handmade Gifts',
    description: 'Find unique second anniversary gifts. Handcrafted crochet decor, forever flowers, and personalized couple gifts.',
    ogDescription: 'Find unique second anniversary gifts. Handcrafted crochet decor, forever flowers, and personalized couple gifts.',
    hero: {
      badge: '❤️ 2nd Anniversary',
      heading: 'Second Anniversary Gifts',
      subheading: 'Celebrate two years of love with a beautiful handmade crochet creation.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: '2nd Anniversary',
    gridLabel: '2nd anniversary gift ideas',
    itemListName: '2nd Anniversary Gifts',
    seoArticle: [
      {
        heading: 'Meaningful Handmade Gifts',
        level: 'h2',
        paragraphs: ['Show how much your love has grown with a handcrafted crochet gift that will last a lifetime.']
      }
    ],
    relatedSlugs: ['first-anniversary', 'anniversary', 'premium'],
  },
  {
    slug: '5th-anniversary',
    title: '5th Anniversary Gifts | Premium Handmade Gifts',
    description: 'Shop premium 5th anniversary gifts. Luxury crochet flower bouquets and intricate handmade decor for your milestone.',
    ogDescription: 'Shop premium 5th anniversary gifts. Luxury crochet flower bouquets and intricate handmade decor.',
    hero: {
      badge: '💖 5th Anniversary',
      heading: '5th Anniversary Gifts',
      subheading: 'Five years calls for something special. Explore our premium handmade crochet collection.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets'], minPrice: 800 },
    orderBy: 'price_desc',
    breadcrumbLabel: '5th Anniversary',
    gridLabel: '5th anniversary gift ideas',
    itemListName: '5th Anniversary Gifts',
    seoArticle: [
      {
        heading: 'Celebrate Half a Decade',
        level: 'h2',
        paragraphs: ['Our large, intricate crochet bouquets are the perfect statement piece to celebrate five wonderful years together.']
      }
    ],
    relatedSlugs: ['10th-anniversary', 'anniversary', 'premium'],
  },
  {
    slug: '10th-anniversary',
    title: '10th Anniversary Gifts | Luxury Handmade Gifts',
    description: 'Find luxury 10th anniversary gifts. Our finest, most intricate handmade crochet flower arrangements and premium gifts.',
    ogDescription: 'Find luxury 10th anniversary gifts. Our finest, most intricate handmade crochet flower arrangements.',
    hero: {
      badge: '💍 10th Anniversary',
      heading: '10th Anniversary Gifts',
      subheading: 'A decade of love deserves our most exquisite, premium handmade creations.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets'], minPrice: 1000 },
    orderBy: 'price_desc',
    breadcrumbLabel: '10th Anniversary',
    gridLabel: '10th anniversary gift ideas',
    itemListName: '10th Anniversary Gifts',
    seoArticle: [
      {
        heading: 'A Decade to Remember',
        level: 'h2',
        paragraphs: ['Honor ten years of marriage with an unforgettable, luxury handmade crochet bouquet that symbolizes lasting love.']
      }
    ],
    relatedSlugs: ['5th-anniversary', 'anniversary', 'premium'],
  },
  {
    slug: 'long-distance-relationship',
    title: 'Long Distance Relationship Gifts | LDR Care Packages',
    description: 'Shop gifts for long distance relationships. Handmade matching keychains, cute amigurumi, and thoughtful care package items.',
    ogDescription: 'Shop gifts for long distance relationships. Handmade matching keychains, cute amigurumi, and thoughtful items.',
    hero: {
      badge: '✈️ Across the Miles',
      heading: 'Long Distance Relationship Gifts',
      subheading: 'Bridge the gap with a tangible, handmade reminder of your love.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'LDR Gifts',
    gridLabel: 'Long distance gift ideas',
    itemListName: 'Long Distance Relationship Gifts',
    seoArticle: [
      {
        heading: 'Stay Close with Handmade Gifts',
        level: 'h2',
        paragraphs: ['A handmade crochet keychain or plushie is perfect for an LDR. It\'s a small, physical item they can carry with them to feel closer to you.']
      }
    ],
    relatedSlugs: ['for-couples', 'just-because', 'valentines-day'],
  },
  {
    slug: 'first-date',
    title: 'First Date Gifts | Small & Thoughtful Gifts',
    description: 'Find the perfect first date gift. Small, not-too-overwhelming handmade crochet flowers or cute keychains.',
    ogDescription: 'Find the perfect first date gift. Small, not-too-overwhelming handmade crochet flowers or cute keychains.',
    hero: {
      badge: '🌸 First Date',
      heading: 'First Date Gifts',
      subheading: 'Make a sweet first impression with a small, thoughtful handmade crochet gift.',
    },
    productFilter: { type: 'combo', slugs: ['keychains', 'flower-pots'], maxPrice: 400 },
    orderBy: 'price_asc',
    breadcrumbLabel: 'First Date',
    gridLabel: 'First date gift ideas',
    itemListName: 'First Date Gifts',
    seoArticle: [
      {
        heading: 'The Perfect Ice Breaker',
        level: 'h2',
        paragraphs: ['A single crochet flower or a cute keychain is a charming, memorable first date gift that shows thoughtfulness without being "too much."']
      }
    ],
    relatedSlugs: ['just-because', 'under-300', 'affordable'],
  },
  {
    slug: 'proposal',
    title: 'Proposal Gifts | Romantic Proposal Prop Ideas',
    description: 'Make your proposal special with a handmade gift. Hide the ring in a custom crochet flower or beautiful amigurumi box.',
    ogDescription: 'Make your proposal special with a handmade gift. Custom crochet flowers and amigurumi.',
    hero: {
      badge: '💍 Will You Marry Me?',
      heading: 'Proposal Gifts',
      subheading: 'Add a unique, handmade touch to the most important question of your life.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Proposal Gifts',
    gridLabel: 'Proposal gift ideas',
    itemListName: 'Proposal Gifts',
    seoArticle: [
      {
        heading: 'A Unique Proposal',
        level: 'h2',
        paragraphs: ['Incorporate a premium handmade crochet bouquet into your proposal for a prop that you can keep as a memento of that special day forever.']
      }
    ],
    relatedSlugs: ['engagement', 'premium', 'for-girlfriend'],
  },
  {
    slug: 'bride-to-be',
    title: 'Bride to Be Gifts | Bridal Handmade Gifts',
    description: 'Shop gifts for the bride to be. Beautiful handmade crochet flower bouquets, hair accessories, and keepsakes.',
    ogDescription: 'Shop gifts for the bride to be. Beautiful handmade crochet flower bouquets, hair accessories, and keepsakes.',
    hero: {
      badge: '👰 Bride to Be',
      heading: 'Gifts for the Bride-to-Be',
      subheading: 'Celebrate her upcoming wedding with a beautiful, handcrafted keepsake.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bride to Be Gifts',
    gridLabel: 'Bride to be gift ideas',
    itemListName: 'Bride to Be Gifts',
    seoArticle: [
      {
        heading: 'Handmade Bridal Keepsakes',
        level: 'h2',
        paragraphs: ['Our crochet gifts make wonderful presents for a bride-to-be, offering a touch of handmade charm during her wedding preparations.']
      }
    ],
    relatedSlugs: ['bridal-shower', 'wedding', 'for-friend'],
  },
  {
    slug: 'bridal-shower',
    title: 'Bridal Shower Gifts | Unique Handmade Bridal Gifts',
    description: 'Find unique bridal shower gifts. Handcrafted crochet home decor, elegant bouquets, and personalized presents.',
    ogDescription: 'Find unique bridal shower gifts. Handcrafted crochet home decor, elegant bouquets, and personalized presents.',
    hero: {
      badge: '🥂 Bridal Shower',
      heading: 'Bridal Shower Gifts',
      subheading: 'Stand out from the registry with a unique, handmade crochet gift for her bridal shower.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bridal Shower Gifts',
    gridLabel: 'Bridal shower gift ideas',
    itemListName: 'Bridal Shower Gifts',
    seoArticle: [
      {
        heading: 'Gifts That Stand Out',
        level: 'h2',
        paragraphs: ['A handmade crochet bouquet or decor piece is a thoughtful, off-registry gift that the bride will truly appreciate at her shower.']
      }
    ],
    relatedSlugs: ['bride-to-be', 'wedding', 'premium'],
  },

  // ═══════════════════════════════════════════
  // COMBO: OCCASION + RECIPIENT
  // ═══════════════════════════════════════════

  {
    slug: 'anniversary-for-girlfriend',
    title: 'Anniversary Gifts for Girlfriend | Romantic Handmade Gifts',
    description: 'Find romantic handmade anniversary gifts for your girlfriend. Premium crochet flower bouquets and thoughtful keepsakes to celebrate your love.',
    ogDescription: 'Find romantic handmade anniversary gifts for your girlfriend. Premium crochet flower bouquets and thoughtful keepsakes.',
    hero: {
      badge: '❤️ Anniversary Love',
      heading: 'Anniversary Gifts for Girlfriend',
      subheading: 'Show her how much she means to you with a stunning, forever-lasting handmade gift.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets', 'hair-accessories'], minPrice: 500 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Anniversary for Girlfriend',
    gridLabel: 'Anniversary gifts for her',
    itemListName: 'Anniversary Gifts for Girlfriend',
    seoArticle: [
      {
        heading: 'Romantic Handmade Anniversary Gifts',
        level: 'h2',
        paragraphs: ['Celebrate your anniversary with a premium crochet flower bouquet that represents a love that never wilts.']
      }
    ],
    relatedSlugs: ['anniversary', 'for-girlfriend', 'valentines-for-girlfriend'],
  },
  {
    slug: 'anniversary-for-boyfriend',
    title: 'Anniversary Gifts for Boyfriend | Unique Handmade Gifts',
    description: 'Shop unique handmade anniversary gifts for your boyfriend. Personalized crochet keychains, amigurumi, and thoughtful presents.',
    ogDescription: 'Shop unique handmade anniversary gifts for your boyfriend. Personalized crochet keychains and amigurumi.',
    hero: {
      badge: '❤️ Anniversary Love',
      heading: 'Anniversary Gifts for Boyfriend',
      subheading: 'Surprise him on your anniversary with a unique, handcrafted gift made just for him.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Anniversary for Boyfriend',
    gridLabel: 'Anniversary gifts for him',
    itemListName: 'Anniversary Gifts for Boyfriend',
    seoArticle: [
      {
        heading: 'Unique Gifts He\'ll Actually Love',
        level: 'h2',
        paragraphs: ['Skip the usual gifts and get him a handmade crochet keychain of his favorite character to mark your special day.']
      }
    ],
    relatedSlugs: ['anniversary', 'for-boyfriend', 'valentines-for-boyfriend'],
  },
  {
    slug: 'anniversary-for-wife',
    title: 'Anniversary Gifts for Wife | Premium Romantic Gifts',
    description: 'Find premium romantic anniversary gifts for your wife. Large handmade crochet bouquets and luxury keepsakes.',
    ogDescription: 'Find premium romantic anniversary gifts for your wife. Large handmade crochet bouquets and luxury keepsakes.',
    hero: {
      badge: '💝 For My Wife',
      heading: 'Anniversary Gifts for Wife',
      subheading: 'Celebrate your marriage with an exquisite, premium handmade crochet arrangement.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets'], minPrice: 800 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Anniversary for Wife',
    gridLabel: 'Anniversary gifts for wife',
    itemListName: 'Anniversary Gifts for Wife',
    seoArticle: [
      {
        heading: 'A Forever Gift for Your Forever Love',
        level: 'h2',
        paragraphs: ['Show your wife how much she means to you with a luxury handmade crochet bouquet that will stay beautiful forever.']
      }
    ],
    relatedSlugs: ['anniversary', 'for-wife', 'valentines-for-wife'],
  },
  {
    slug: 'anniversary-for-husband',
    title: 'Anniversary Gifts for Husband | Thoughtful Handmade Gifts',
    description: 'Shop thoughtful anniversary gifts for your husband. Unique handmade crochet gifts, desk accessories, and personalized keepsakes.',
    ogDescription: 'Shop thoughtful anniversary gifts for your husband. Unique handmade crochet gifts and desk accessories.',
    hero: {
      badge: '💝 For My Husband',
      heading: 'Anniversary Gifts for Husband',
      subheading: 'Mark another wonderful year of marriage with a unique handmade gift he\'ll treasure.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Anniversary for Husband',
    gridLabel: 'Anniversary gifts for husband',
    itemListName: 'Anniversary Gifts for Husband',
    seoArticle: [
      {
        heading: 'Thoughtful Gifts for Him',
        level: 'h2',
        paragraphs: ['A handmade crochet desk plant or personalized keychain is a subtle, meaningful way to celebrate your anniversary together.']
      }
    ],
    relatedSlugs: ['anniversary', 'for-husband', 'valentines-for-husband'],
  },
  {
    slug: 'birthday-for-girlfriend',
    title: 'Birthday Gifts for Girlfriend | Cute Handmade Gifts',
    description: 'Find cute birthday gifts for your girlfriend. Handmade crochet plushies, beautiful flowers, and romantic surprises.',
    ogDescription: 'Find cute birthday gifts for your girlfriend. Handmade crochet plushies, beautiful flowers, and romantic surprises.',
    hero: {
      badge: '🎂 Happy Birthday',
      heading: 'Birthday Gifts for Girlfriend',
      subheading: 'Make her birthday extra special with an adorable, handcrafted crochet gift.',
    },
    productFilter: { type: 'combo', slugs: ['toys', 'flower-bouquets', 'hair-accessories'], maxPrice: 1500 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Birthday for Girlfriend',
    gridLabel: 'Birthday gifts for her',
    itemListName: 'Birthday Gifts for Girlfriend',
    seoArticle: [
      {
        heading: 'Make Her Birthday Unforgettable',
        level: 'h2',
        paragraphs: ['A cute amigurumi plushie or a stunning crochet flower bouquet is the perfect unique birthday surprise for your girlfriend.']
      }
    ],
    relatedSlugs: ['birthday', 'for-girlfriend', 'under-500-for-girlfriend'],
  },
  {
    slug: 'birthday-for-boyfriend',
    title: 'Birthday Gifts for Boyfriend | Fun Handmade Gifts',
    description: 'Shop fun birthday gifts for your boyfriend. Handmade crochet keychains, quirky amigurumi, and unique presents.',
    ogDescription: 'Shop fun birthday gifts for your boyfriend. Handmade crochet keychains, quirky amigurumi, and unique presents.',
    hero: {
      badge: '🎂 Happy Birthday',
      heading: 'Birthday Gifts for Boyfriend',
      subheading: 'Get him a fun, personalized handmade gift that he\'ll love showing off.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Birthday for Boyfriend',
    gridLabel: 'Birthday gifts for him',
    itemListName: 'Birthday Gifts for Boyfriend',
    seoArticle: [
      {
        heading: 'Unique Birthday Gifts He\'ll Love',
        level: 'h2',
        paragraphs: ['Skip the boring shirts and wallets. Gift him a quirky, handmade crochet item that matches his personality.']
      }
    ],
    relatedSlugs: ['birthday', 'for-boyfriend', 'under-500-for-boyfriend'],
  },
  {
    slug: 'birthday-for-wife',
    title: 'Birthday Gifts for Wife | Premium Romantic Surprises',
    description: 'Find premium birthday gifts for your wife. Stunning handmade crochet flower arrangements and luxury decor gifts.',
    ogDescription: 'Find premium birthday gifts for your wife. Stunning handmade crochet flower arrangements and luxury decor.',
    hero: {
      badge: '🎉 Happy Birthday',
      heading: 'Birthday Gifts for Wife',
      subheading: 'Spoil her on her birthday with our finest, premium handmade crochet creations.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets', 'flower-pots'], minPrice: 600 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Birthday for Wife',
    gridLabel: 'Birthday gifts for wife',
    itemListName: 'Birthday Gifts for Wife',
    seoArticle: [
      {
        heading: 'Spoil Her on Her Special Day',
        level: 'h2',
        paragraphs: ['A premium handmade crochet bouquet is a luxurious, thoughtful birthday gift that she can keep as a permanent reminder of your love.']
      }
    ],
    relatedSlugs: ['birthday', 'for-wife', 'anniversary-for-wife'],
  },
  {
    slug: 'birthday-for-husband',
    title: 'Birthday Gifts for Husband | Thoughtful Surprises',
    description: 'Shop thoughtful birthday gifts for your husband. Unique handmade crochet desk accessories and fun keychains.',
    ogDescription: 'Shop thoughtful birthday gifts for your husband. Unique handmade crochet desk accessories and fun keychains.',
    hero: {
      badge: '🎉 Happy Birthday',
      heading: 'Birthday Gifts for Husband',
      subheading: 'Surprise him with a clever, handmade crochet gift for his desk or car.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Birthday for Husband',
    gridLabel: 'Birthday gifts for husband',
    itemListName: 'Birthday Gifts for Husband',
    seoArticle: [
      {
        heading: 'Clever Birthday Gifts for Him',
        level: 'h2',
        paragraphs: ['A zero-maintenance crochet desk plant is a fun and thoughtful birthday gift for your husband\'s office.']
      }
    ],
    relatedSlugs: ['birthday', 'for-husband', 'anniversary-for-husband'],
  },
  {
    slug: 'valentines-for-girlfriend',
    title: 'Valentine\'s Day Gifts for Girlfriend | Romantic Gifts',
    description: 'Find the perfect Valentine\'s Day gift for your girlfriend. Handmade crochet roses, plushies, and romantic gifts.',
    ogDescription: 'Find the perfect Valentine\'s Day gift for your girlfriend. Handmade crochet roses, plushies, and romantic gifts.',
    hero: {
      badge: '💘 Be My Valentine',
      heading: 'Valentine\'s Gifts for Girlfriend',
      subheading: 'Skip the real roses that wilt. Give her forever-lasting handmade crochet flowers.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets', 'toys'], minPrice: 400 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Valentine\'s for Girlfriend',
    gridLabel: 'Valentine\'s gifts for her',
    itemListName: 'Valentine\'s Gifts for Girlfriend',
    seoArticle: [
      {
        heading: 'Romantic Gifts that Last Forever',
        level: 'h2',
        paragraphs: ['Show your romantic side with a beautiful, handmade crochet rose bouquet that will last as long as your love.']
      }
    ],
    relatedSlugs: ['valentines-day', 'for-girlfriend', 'anniversary-for-girlfriend'],
  },
  {
    slug: 'valentines-for-boyfriend',
    title: 'Valentine\'s Day Gifts for Boyfriend | Cute Handmade Gifts',
    description: 'Shop cute Valentine\'s Day gifts for your boyfriend. Fun handmade crochet keychains and thoughtful romantic gifts.',
    ogDescription: 'Shop cute Valentine\'s Day gifts for your boyfriend. Fun handmade crochet keychains and thoughtful romantic gifts.',
    hero: {
      badge: '💘 Be My Valentine',
      heading: 'Valentine\'s Gifts for Boyfriend',
      subheading: 'Get him something cute and handmade to show your love this Valentine\'s Day.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Valentine\'s for Boyfriend',
    gridLabel: 'Valentine\'s gifts for him',
    itemListName: 'Valentine\'s Gifts for Boyfriend',
    seoArticle: [
      {
        heading: 'Cute and Thoughtful Valentine\'s Gifts',
        level: 'h2',
        paragraphs: ['A small, handmade crochet keychain is a sweet, subtle way to say "I love you" this Valentine\'s Day.']
      }
    ],
    relatedSlugs: ['valentines-day', 'for-boyfriend', 'anniversary-for-boyfriend'],
  },
  {
    slug: 'mothers-day-for-mom',
    title: 'Mother\'s Day Gifts for Mom | Thoughtful Handmade Gifts',
    description: 'Find the perfect Mother\'s Day gift for mom. Beautiful handmade crochet flower pots and delicate accessories she\'ll love.',
    ogDescription: 'Find the perfect Mother\'s Day gift for mom. Beautiful handmade crochet flower pots and delicate accessories.',
    hero: {
      badge: '🌸 We Love You Mom',
      heading: 'Mother\'s Day Gifts for Mom',
      subheading: 'Thank her for everything with a beautiful, handmade gift crafted with love.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Mother\'s Day',
    gridLabel: 'Mother\'s Day gift ideas',
    itemListName: 'Mother\'s Day Gifts for Mom',
    seoArticle: [
      {
        heading: 'Handmade Gifts for the Best Mom',
        level: 'h2',
        paragraphs: ['Show Mom your appreciation with a stunning, forever-lasting crochet flower pot that will brighten up her favorite room.']
      }
    ],
    relatedSlugs: ['mothers-day', 'for-mom', 'under-500-for-mom'],
  },
  {
    slug: 'raksha-bandhan-for-sister',
    title: 'Raksha Bandhan Gifts for Sister | Handmade Surprises',
    description: 'Shop Raksha Bandhan gifts for your sister. Cute handmade crochet keychains, hair accessories, and plushies.',
    ogDescription: 'Shop Raksha Bandhan gifts for your sister. Cute handmade crochet keychains, hair accessories, and plushies.',
    hero: {
      badge: '🎀 Happy Rakhi',
      heading: 'Rakhi Gifts for Sister',
      subheading: 'Spoil your sister with adorable, handcrafted crochet accessories and toys.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories', 'toys', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Rakhi for Sister',
    gridLabel: 'Rakhi gifts for sister',
    itemListName: 'Raksha Bandhan Gifts for Sister',
    seoArticle: [
      {
        heading: 'Spoil Your Sister this Rakhi',
        level: 'h2',
        paragraphs: ['Fulfill your Rakhi promise with a beautiful, handmade crochet gift that she will genuinely love and use.']
      }
    ],
    relatedSlugs: ['raksha-bandhan', 'for-sister', 'bhai-dooj'],
  },
  {
    slug: 'raksha-bandhan-for-brother',
    title: 'Raksha Bandhan Gifts for Brother | Unique Handmade Gifts',
    description: 'Find unique Raksha Bandhan gifts for your brother. Cool handmade crochet keychains and fun desk accessories.',
    ogDescription: 'Find unique Raksha Bandhan gifts for your brother. Cool handmade crochet keychains and fun desk accessories.',
    hero: {
      badge: '🎁 Happy Rakhi',
      heading: 'Rakhi Gifts for Brother',
      subheading: 'Surprise your brother with a cool, handmade crochet gift along with his Rakhi.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Rakhi for Brother',
    gridLabel: 'Rakhi gifts for brother',
    itemListName: 'Raksha Bandhan Gifts for Brother',
    seoArticle: [
      {
        heading: 'Unique Rakhi Gifts for Him',
        level: 'h2',
        paragraphs: ['A handmade crochet keychain of his favorite character is the perfect add-on to your Rakhi this year.']
      }
    ],
    relatedSlugs: ['raksha-bandhan', 'for-brother', 'bhai-dooj'],
  },
  {
    slug: 'friendship-day-for-best-friend',
    title: 'Friendship Day Gifts for Best Friend | Handmade Gifts',
    description: 'Shop Friendship Day gifts for your best friend. Cute matching handmade crochet keychains and thoughtful presents.',
    ogDescription: 'Shop Friendship Day gifts for your best friend. Cute matching handmade crochet keychains and thoughtful presents.',
    hero: {
      badge: '👯 Besties Forever',
      heading: 'Friendship Day Gifts for Bestie',
      subheading: 'Celebrate your bond with cute, matching handmade crochet accessories.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Friendship Day',
    gridLabel: 'Friendship Day gifts',
    itemListName: 'Friendship Day Gifts for Best Friend',
    seoArticle: [
      {
        heading: 'Gifts for Your Partner in Crime',
        level: 'h2',
        paragraphs: ['A matching set of handmade crochet keychains is the ultimate modern friendship bracelet for Friendship Day.']
      }
    ],
    relatedSlugs: ['friendship-day', 'for-best-friend', 'under-500-for-friend'],
  },
  {
    slug: 'baby-shower-for-mom',
    title: 'Baby Shower Gifts for Mom-to-Be | Handmade Nursery Gifts',
    description: 'Find baby shower gifts for the expecting mom. Soft, safe handmade crochet amigurumi toys and beautiful nursery decor.',
    ogDescription: 'Find baby shower gifts for the expecting mom. Soft, safe handmade crochet amigurumi toys and nursery decor.',
    hero: {
      badge: '🍼 Mom to Be',
      heading: 'Baby Shower Gifts for Mom',
      subheading: 'Gift her something soft, safe, and made with love for the new arrival.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Baby Shower for Mom',
    gridLabel: 'Baby shower gift ideas',
    itemListName: 'Baby Shower Gifts for Mom',
    seoArticle: [
      {
        heading: 'Handmade Love for the Nursery',
        level: 'h2',
        paragraphs: ['Our amigurumi crochet toys are crafted with extreme care, making them the perfect, safe handmade gift for an expecting mother\'s baby shower.']
      }
    ],
    relatedSlugs: ['baby-shower', 'for-new-mom', 'naming-ceremony'],
  },
  {
    slug: 'diwali-for-family',
    title: 'Diwali Gifts for Family | Festive Handmade Decor',
    description: 'Shop Diwali gifts for family. Beautiful handmade crochet flower pots and festive decor that brightens up the home.',
    ogDescription: 'Shop Diwali gifts for family. Beautiful handmade crochet flower pots and festive decor.',
    hero: {
      badge: '🪔 Happy Diwali',
      heading: 'Diwali Gifts for Family',
      subheading: 'Brighten their home this festive season with beautiful handmade crochet decor.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots', 'flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Diwali for Family',
    gridLabel: 'Diwali gifts for family',
    itemListName: 'Diwali Gifts for Family',
    seoArticle: [
      {
        heading: 'Festive Decor that Lasts',
        level: 'h2',
        paragraphs: ['Skip the temporary flowers and gift your family a beautiful handmade crochet flower pot that will stay vibrant long after Diwali is over.']
      }
    ],
    relatedSlugs: ['diwali', 'housewarming', 'premium'],
  },
  {
    slug: 'christmas-for-girlfriend',
    title: 'Christmas Gifts for Girlfriend | Cozy Handmade Gifts',
    description: 'Find cozy Christmas gifts for your girlfriend. Cute handmade crochet plushies and beautiful winter accessories.',
    ogDescription: 'Find cozy Christmas gifts for your girlfriend. Cute handmade crochet plushies and beautiful winter accessories.',
    hero: {
      badge: '🎄 Merry Christmas',
      heading: 'Christmas Gifts for Girlfriend',
      subheading: 'Warm her heart this holiday season with a cozy, handcrafted crochet gift.',
    },
    productFilter: { type: 'combo', slugs: ['toys', 'flower-bouquets'], minPrice: 400 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Christmas for Girlfriend',
    gridLabel: 'Christmas gifts for her',
    itemListName: 'Christmas Gifts for Girlfriend',
    seoArticle: [
      {
        heading: 'Cozy Handmade Holiday Gifts',
        level: 'h2',
        paragraphs: ['Handmade crochet gifts carry a special warmth that makes them perfect for cuddling under the tree on Christmas morning.']
      }
    ],
    relatedSlugs: ['christmas', 'for-girlfriend', 'valentines-for-girlfriend'],
  },
  {
    slug: 'christmas-for-boyfriend',
    title: 'Christmas Gifts for Boyfriend | Unique Handmade Gifts',
    description: 'Shop Christmas gifts for your boyfriend. Unique handmade crochet keychains, amigurumi characters, and fun stocking stuffers.',
    ogDescription: 'Shop Christmas gifts for your boyfriend. Unique handmade crochet keychains, amigurumi characters, and fun stocking stuffers.',
    hero: {
      badge: '🎄 Merry Christmas',
      heading: 'Christmas Gifts for Boyfriend',
      subheading: 'Find the perfect unique handmade stocking stuffer for him this Christmas.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Christmas for Boyfriend',
    gridLabel: 'Christmas gifts for him',
    itemListName: 'Christmas Gifts for Boyfriend',
    seoArticle: [
      {
        heading: 'Unique Handmade Stocking Stuffers',
        level: 'h2',
        paragraphs: ['Our handmade crochet keychains make the perfect unique stocking stuffer for your boyfriend this Christmas.']
      }
    ],
    relatedSlugs: ['christmas', 'for-boyfriend', 'under-500-for-boyfriend'],
  },
  {
    slug: 'valentines-for-wife',
    title: 'Valentine\'s Day Gifts for Wife | Premium Romantic Gifts',
    description: 'Find premium Valentine\'s Day gifts for your wife. Large handmade crochet flower bouquets that never wilt.',
    ogDescription: 'Find premium Valentine\'s Day gifts for your wife. Large handmade crochet flower bouquets that never wilt.',
    hero: {
      badge: '💘 Forever Valentine',
      heading: 'Valentine\'s Gifts for Wife',
      subheading: 'Give her a luxury handmade crochet bouquet that stays as beautiful as your love.',
    },
    productFilter: { type: 'combo', slugs: ['flower-bouquets'], minPrice: 800 },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Valentine\'s for Wife',
    gridLabel: 'Valentine\'s gifts for wife',
    itemListName: 'Valentine\'s Gifts for Wife',
    seoArticle: [
      {
        heading: 'A Bouquet That Never Wilts',
        level: 'h2',
        paragraphs: ['This Valentine\'s Day, upgrade from traditional roses to a premium handmade crochet bouquet that will never fade or wither.']
      }
    ],
    relatedSlugs: ['valentines-day', 'for-wife', 'anniversary-for-wife'],
  },
  {
    slug: 'valentines-for-husband',
    title: 'Valentine\'s Day Gifts for Husband | Thoughtful Gifts',
    description: 'Shop thoughtful Valentine\'s Day gifts for your husband. Unique handmade crochet gifts and personalized presents.',
    ogDescription: 'Shop thoughtful Valentine\'s Day gifts for your husband. Unique handmade crochet gifts and personalized presents.',
    hero: {
      badge: '💘 Forever Valentine',
      heading: 'Valentine\'s Gifts for Husband',
      subheading: 'Surprise him with a thoughtful, handmade gift to celebrate your love.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Valentine\'s for Husband',
    gridLabel: 'Valentine\'s gifts for husband',
    itemListName: 'Valentine\'s Gifts for Husband',
    seoArticle: [
      {
        heading: 'Thoughtful Handmade Gifts for Him',
        level: 'h2',
        paragraphs: ['A handmade crochet desk plant or character keychain is a fun and unique way to show your husband you love him this Valentine\'s Day.']
      }
    ],
    relatedSlugs: ['valentines-day', 'for-husband', 'anniversary-for-husband'],
  }
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Look up a gift page config by slug */
export function getGiftPageBySlug(slug: string): GiftPageConfig | undefined {
  return GIFT_PAGES.find((p) => p.slug === slug);
}

/** Get all valid gift page slugs (for generateStaticParams) */
export function getAllGiftSlugs(): string[] {
  return GIFT_PAGES.map((p) => p.slug);
}

/** Get a short label for a slug (used in MoreGiftIdeas) */
export function getGiftPageLabel(slug: string): string {
  const page = getGiftPageBySlug(slug);
  return page?.breadcrumbLabel ?? slug;
}
