import { GiftPageConfig } from './gift-pages';

export const SEO_PAGES: GiftPageConfig[] = [
  {
    slug: 'crochet-flowers',
    title: 'Crochet Flowers | Handmade Crochet Flowers India',
    description: 'Shop beautiful handmade crochet flowers online. Premium crochet bouquets, single roses, tulips, and sunflowers that last forever.',
    ogDescription: 'Shop beautiful handmade crochet flowers online. Premium crochet bouquets, single roses, and sunflowers that last forever.',
    hero: {
      badge: '🌸 Forever Bloom',
      heading: 'Handmade Crochet Flowers',
      subheading: 'Discover our premium collection of handcrafted crochet flowers that never wilt.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Crochet Flowers',
    gridLabel: 'Shop crochet flowers',
    itemListName: 'Crochet Flowers Collection',
    seoArticle: [
      {
        heading: 'Why Choose Handmade Crochet Flowers?',
        level: 'h2',
        paragraphs: [
          'Crochet flowers are the perfect alternative to real flowers. They are meticulously handcrafted with premium yarn, ensuring they stay vibrant, soft, and beautiful forever without any maintenance or watering.'
        ]
      }
    ],
    relatedSlugs: ['crochet-flower-bouquets', 'everlasting-flowers', 'flowers-that-never-wilt'],
  },
  {
    slug: 'crochet-flower-bouquets',
    title: 'Crochet Flower Bouquets | Premium Handmade Bouquets',
    description: 'Buy premium crochet flower bouquets online in India. Beautiful, custom handmade bouquets perfect for gifting on any occasion.',
    ogDescription: 'Buy premium crochet flower bouquets online in India. Beautiful, custom handmade bouquets perfect for gifting.',
    hero: {
      badge: '💐 Premium Bouquets',
      heading: 'Crochet Flower Bouquets',
      subheading: 'Stunning, handcrafted flower arrangements that make the perfect lasting gift.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Crochet Bouquets',
    gridLabel: 'Crochet flower bouquets',
    itemListName: 'Crochet Flower Bouquets',
    seoArticle: [
      {
        heading: 'A Gift That Lasts Forever',
        level: 'h2',
        paragraphs: [
          'A crochet flower bouquet is more than just a gift; it is a lasting piece of art. Perfect for anniversaries, birthdays, and Valentine\'s Day, these bouquets offer a unique twist on traditional flower gifting.'
        ]
      }
    ],
    relatedSlugs: ['crochet-flowers', 'forever-flowers', 'personalized-crochet-bouquet'],
  },
  {
    slug: 'crochet-rose-bouquet',
    title: 'Crochet Rose Bouquet | Handmade Crochet Roses',
    description: 'Shop romantic crochet rose bouquets. Beautiful handmade red roses, pink roses, and custom crochet flower arrangements.',
    ogDescription: 'Shop romantic crochet rose bouquets. Beautiful handmade red roses, pink roses, and custom arrangements.',
    hero: {
      badge: '🌹 Romantic Roses',
      heading: 'Crochet Rose Bouquets',
      subheading: 'Express your love with stunning, handcrafted crochet roses that never fade.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Rose Bouquets',
    gridLabel: 'Crochet rose bouquets',
    itemListName: 'Crochet Rose Bouquets',
    seoArticle: [
      {
        heading: 'The Ultimate Symbol of Love',
        level: 'h2',
        paragraphs: [
          'Roses are the classic symbol of romance. A handmade crochet rose bouquet elevates this tradition by offering a beautiful floral arrangement that acts as a permanent keepsake of your affection.'
        ]
      }
    ],
    relatedSlugs: ['crochet-flower-bouquets', 'crochet-bouquet-for-girlfriend', 'crochet-bouquet-for-valentines'],
  },
  {
    slug: 'crochet-tulip-bouquet',
    title: 'Crochet Tulip Bouquet | Handmade Crochet Tulips',
    description: 'Discover beautiful crochet tulip bouquets. Handmade pastel tulips, vibrant spring flowers, and perfect gifts for her.',
    ogDescription: 'Discover beautiful crochet tulip bouquets. Handmade pastel tulips and vibrant spring flowers.',
    hero: {
      badge: '🌷 Elegant Tulips',
      heading: 'Crochet Tulip Bouquets',
      subheading: 'Bring the joy of spring indoors with our beautiful, handcrafted crochet tulips.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Tulip Bouquets',
    gridLabel: 'Crochet tulip bouquets',
    itemListName: 'Crochet Tulip Bouquets',
    seoArticle: [
      {
        heading: 'Elegant and Cheerful',
        level: 'h2',
        paragraphs: [
          'Tulips represent perfect love and cheerful thoughts. Our crochet tulip bouquets capture the elegant shape and bright colors of real tulips, beautifully crafted in soft yarn.'
        ]
      }
    ],
    relatedSlugs: ['crochet-flower-bouquets', 'crochet-flowers', 'flowers-that-last-forever'],
  },
  {
    slug: 'crochet-sunflower-bouquet',
    title: 'Crochet Sunflower Bouquet | Bright Handmade Sunflowers',
    description: 'Shop bright and cheerful crochet sunflower bouquets. The perfect handmade gift to bring sunshine and happiness to someone\'s day.',
    ogDescription: 'Shop bright and cheerful crochet sunflower bouquets. The perfect handmade gift to bring sunshine and happiness.',
    hero: {
      badge: '🌻 Radiant Sunflowers',
      heading: 'Crochet Sunflower Bouquets',
      subheading: 'Brighten their day with a cheerful, handcrafted crochet sunflower bouquet.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Sunflower Bouquets',
    gridLabel: 'Crochet sunflower bouquets',
    itemListName: 'Crochet Sunflower Bouquets',
    seoArticle: [
      {
        heading: 'A Gift of Positivity',
        level: 'h2',
        paragraphs: [
          'Sunflowers symbolize adoration, loyalty, and longevity. A crochet sunflower bouquet is the perfect uplifting gift for a friend, a graduation, or a get-well-soon surprise.'
        ]
      }
    ],
    relatedSlugs: ['crochet-flower-bouquets', 'crochet-bouquet-for-friend', 'everlasting-flowers'],
  },
  {
    slug: 'crochet-flower-pot',
    title: 'Crochet Flower Pots | Handmade Desk Plants & Decor',
    description: 'Discover adorable crochet flower pots. Zero-maintenance handmade desk plants, miniature flowers, and unique home decor.',
    ogDescription: 'Discover adorable crochet flower pots. Zero-maintenance handmade desk plants, miniature flowers, and unique home decor.',
    hero: {
      badge: '🪴 Cute Decor',
      heading: 'Crochet Flower Pots',
      subheading: 'Add a touch of handmade charm to your desk or home with our zero-maintenance crochet plants.',
    },
    productFilter: { type: 'category', slugs: ['flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Flower Pots',
    gridLabel: 'Crochet flower pots',
    itemListName: 'Crochet Flower Pots',
    seoArticle: [
      {
        heading: 'The Perfect Desk Companion',
        level: 'h2',
        paragraphs: [
          'Love the look of plants but lack a green thumb? Our crochet flower pots are the perfect solution. They bring a pop of color and joy to any workspace or shelf without ever needing water.'
        ]
      }
    ],
    relatedSlugs: ['crochet-flowers', 'alternative-to-real-flowers', 'crochet-vs-real-flowers'],
  },
  {
    slug: 'everlasting-flowers',
    title: 'Everlasting Flowers | Handmade Crochet Floral Gifts',
    description: 'Shop everlasting flowers. Premium handmade crochet bouquets and arrangements that stay beautiful forever without maintenance.',
    ogDescription: 'Shop everlasting flowers. Premium handmade crochet bouquets and arrangements that stay beautiful forever.',
    hero: {
      badge: '✨ Lasts a Lifetime',
      heading: 'Everlasting Flowers',
      subheading: 'Gift a memory that won\'t fade. Shop our collection of premium everlasting crochet flowers.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Everlasting Flowers',
    gridLabel: 'Everlasting flower gifts',
    itemListName: 'Everlasting Flowers',
    seoArticle: [
      {
        heading: 'Why Settle for Wilting Flowers?',
        level: 'h2',
        paragraphs: [
          'Traditional flowers are beautiful but fleeting. Everlasting flowers made from crochet offer the same stunning visual impact, but serve as a permanent keepsake and home decor piece.'
        ]
      }
    ],
    relatedSlugs: ['forever-flowers', 'flowers-that-never-wilt', 'crochet-flower-bouquets'],
  },
  {
    slug: 'forever-flowers',
    title: 'Forever Flowers | Premium Crochet Bouquets India',
    description: 'Discover forever flowers. Handcrafted crochet bouquets, roses, and custom floral arrangements that serve as permanent keepsakes.',
    ogDescription: 'Discover forever flowers. Handcrafted crochet bouquets, roses, and custom floral arrangements.',
    hero: {
      badge: '♾️ Forever Yours',
      heading: 'Forever Flowers',
      subheading: 'Express your eternal love with beautiful, handmade crochet flowers that truly last forever.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Forever Flowers',
    gridLabel: 'Forever flower bouquets',
    itemListName: 'Forever Flowers',
    seoArticle: [
      {
        heading: 'A Permanent Keepsake',
        level: 'h2',
        paragraphs: [
          'When you give forever flowers, you are giving a gift that can be displayed and cherished for years. Our crochet arrangements are meticulously crafted to stand the test of time.'
        ]
      }
    ],
    relatedSlugs: ['everlasting-flowers', 'flowers-that-last-forever', 'crochet-rose-bouquet'],
  },
  {
    slug: 'flowers-that-never-wilt',
    title: 'Flowers That Never Wilt | Handmade Crochet Bouquets',
    description: 'Buy flowers that never wilt. Stunning handmade crochet flower arrangements perfect for gifting, anniversaries, and decor.',
    ogDescription: 'Buy flowers that never wilt. Stunning handmade crochet flower arrangements perfect for gifting.',
    hero: {
      badge: '🌸 Zero Maintenance',
      heading: 'Flowers That Never Wilt',
      subheading: 'Enjoy the beauty of flowers without the heartbreak of them fading away.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Never Wilt Flowers',
    gridLabel: 'Flowers that never wilt',
    itemListName: 'Flowers That Never Wilt',
    seoArticle: [
      {
        heading: 'The Beauty of Crochet Flowers',
        level: 'h2',
        paragraphs: [
          'Imagine a bouquet that looks just as beautiful on day 100 as it did on day 1. Crochet flowers provide exactly that—vibrant, beautiful flowers that never wilt, droop, or lose their color.'
        ]
      }
    ],
    relatedSlugs: ['flowers-that-last-forever', 'everlasting-flowers', 'alternative-to-real-flowers'],
  },
  {
    slug: 'flowers-that-last-forever',
    title: 'Flowers That Last Forever | Permanent Floral Gifts',
    description: 'Find flowers that last forever. Premium handcrafted crochet bouquets. A unique and sustainable alternative to real flowers.',
    ogDescription: 'Find flowers that last forever. Premium handcrafted crochet bouquets and sustainable gifts.',
    hero: {
      badge: '✨ Eternal Beauty',
      heading: 'Flowers That Last Forever',
      subheading: 'Make an unforgettable impression with a handcrafted bouquet designed to last a lifetime.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Last Forever Flowers',
    gridLabel: 'Flowers that last forever',
    itemListName: 'Flowers That Last Forever',
    seoArticle: [
      {
        heading: 'A Sustainable and Beautiful Gift',
        level: 'h2',
        paragraphs: [
          'Choosing flowers that last forever isn\'t just romantic—it\'s sustainable. Our crochet bouquets reduce waste and provide a permanent piece of joyful decor for your loved one\'s home.'
        ]
      }
    ],
    relatedSlugs: ['forever-flowers', 'flowers-that-never-wilt', 'crochet-vs-real-flowers'],
  },
  {
    slug: 'alternative-to-real-flowers',
    title: 'Alternative to Real Flowers | Unique Crochet Bouquets',
    description: 'Looking for an alternative to real flowers? Discover our handmade crochet bouquets—beautiful, allergy-free, and they last forever.',
    ogDescription: 'Looking for an alternative to real flowers? Discover our handmade crochet bouquets.',
    hero: {
      badge: '💡 Better Than Real',
      heading: 'The Best Alternative to Real Flowers',
      subheading: 'Allergy-free, pet-safe, and forever-lasting. Discover the magic of crochet flowers.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Alternative to Flowers',
    gridLabel: 'Real flower alternatives',
    itemListName: 'Alternative to Real Flowers',
    seoArticle: [
      {
        heading: 'Why Choose Crochet Over Real Flowers?',
        level: 'h2',
        paragraphs: [
          'If you\'re searching for an alternative to real flowers, crochet bouquets are the perfect choice. They are hypoallergenic, completely safe for pets, require zero watering, and never need to be thrown away.'
        ]
      }
    ],
    relatedSlugs: ['crochet-vs-real-flowers', 'crochet-vs-artificial-flowers', 'everlasting-flowers'],
  },
  {
    slug: 'crochet-bouquet-for-girlfriend',
    title: 'Crochet Bouquet for Girlfriend | Romantic Floral Gifts',
    description: 'Surprise her with a crochet bouquet for your girlfriend. Handmade roses, tulips, and custom arrangements she will cherish forever.',
    ogDescription: 'Surprise her with a crochet bouquet for your girlfriend. Handmade roses, tulips, and custom arrangements.',
    hero: {
      badge: '❤️ For Her',
      heading: 'Crochet Bouquet for Girlfriend',
      subheading: 'Give her a bouquet as unique and lasting as your relationship.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Bouquet for Girlfriend',
    gridLabel: 'Bouquets for girlfriend',
    itemListName: 'Crochet Bouquet for Girlfriend',
    seoArticle: [
      {
        heading: 'The Ultimate Romantic Gesture',
        level: 'h2',
        paragraphs: [
          'A crochet bouquet for your girlfriend shows incredible thoughtfulness. It\'s a gift she can display in her room forever, always reminding her of you.'
        ]
      }
    ],
    relatedSlugs: ['crochet-rose-bouquet', 'crochet-bouquet-for-valentines', 'crochet-bouquet-for-anniversary'],
  },
  {
    slug: 'crochet-bouquet-for-wife',
    title: 'Crochet Bouquet for Wife | Premium Anniversary Flowers',
    description: 'Find the perfect crochet bouquet for your wife. Luxury handmade flower arrangements for anniversaries, birthdays, and special moments.',
    ogDescription: 'Find the perfect crochet bouquet for your wife. Luxury handmade flower arrangements for anniversaries.',
    hero: {
      badge: '💝 For Your Wife',
      heading: 'Crochet Bouquet for Wife',
      subheading: 'Celebrate your marriage with a premium, forever-lasting handcrafted bouquet.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Bouquet for Wife',
    gridLabel: 'Bouquets for wife',
    itemListName: 'Crochet Bouquet for Wife',
    seoArticle: [
      {
        heading: 'A Meaningful Anniversary Gift',
        level: 'h2',
        paragraphs: [
          'Upgrade from traditional flowers to a stunning crochet bouquet for your wife. These premium arrangements symbolize a love that grows but never fades.'
        ]
      }
    ],
    relatedSlugs: ['crochet-bouquet-for-anniversary', 'personalized-crochet-bouquet', 'forever-flowers'],
  },
  {
    slug: 'crochet-bouquet-for-mom',
    title: 'Crochet Bouquet for Mom | Thoughtful Mother\'s Gifts',
    description: 'Shop a beautiful crochet bouquet for mom. The perfect handmade Mother\'s Day or birthday gift that she can keep forever.',
    ogDescription: 'Shop a beautiful crochet bouquet for mom. The perfect handmade Mother\'s Day or birthday gift.',
    hero: {
      badge: '🌸 For Mom',
      heading: 'Crochet Bouquet for Mom',
      subheading: 'Show your appreciation with a beautiful, handcrafted bouquet she can cherish forever.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Bouquet for Mom',
    gridLabel: 'Bouquets for mom',
    itemListName: 'Crochet Bouquet for Mom',
    seoArticle: [
      {
        heading: 'A Gift She Will Treasure',
        level: 'h2',
        paragraphs: [
          'Mothers love sentimental gifts. A crochet bouquet for mom is the perfect way to give her beautiful flowers that she can keep displayed in the living room for years to come.'
        ]
      }
    ],
    relatedSlugs: ['crochet-flower-pot', 'crochet-tulip-bouquet', 'crochet-flower-bouquets'],
  },
  {
    slug: 'crochet-bouquet-for-friend',
    title: 'Crochet Bouquet for Friend | Cute Friendship Flowers',
    description: 'Find a cute crochet bouquet for a friend. Handmade sunflowers, daisies, and small flower arrangements to brighten their day.',
    ogDescription: 'Find a cute crochet bouquet for a friend. Handmade sunflowers, daisies, and small flower arrangements.',
    hero: {
      badge: '💛 For a Friend',
      heading: 'Crochet Bouquet for Friend',
      subheading: 'Celebrate your friendship with a cheerful, forever-lasting handmade bouquet.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bouquet for Friend',
    gridLabel: 'Bouquets for friends',
    itemListName: 'Crochet Bouquet for Friend',
    seoArticle: [
      {
        heading: 'Brighten Their Day',
        level: 'h2',
        paragraphs: [
          'A vibrant crochet bouquet for a friend, especially one featuring sunflowers or tulips, is a fantastic way to say "thank you" or "happy birthday" with a gift they can keep.'
        ]
      }
    ],
    relatedSlugs: ['crochet-sunflower-bouquet', 'crochet-flower-pot', 'crochet-flowers'],
  },
  {
    slug: 'crochet-bouquet-for-anniversary',
    title: 'Crochet Bouquet for Anniversary | Romantic Gifts',
    description: 'Celebrate with a crochet bouquet for your anniversary. Premium handmade roses and custom floral arrangements representing eternal love.',
    ogDescription: 'Celebrate with a crochet bouquet for your anniversary. Premium handmade roses and custom floral arrangements.',
    hero: {
      badge: '🥂 Happy Anniversary',
      heading: 'Crochet Bouquet for Anniversary',
      subheading: 'Mark your milestone with an exquisite, premium bouquet that lasts a lifetime.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Anniversary Bouquet',
    gridLabel: 'Anniversary bouquets',
    itemListName: 'Crochet Bouquet for Anniversary',
    seoArticle: [
      {
        heading: 'The Perfect Anniversary Tradition',
        level: 'h2',
        paragraphs: [
          'Make your anniversary unforgettable with a gift that stands the test of time. A crochet bouquet for your anniversary is a unique, luxurious keepsake that perfectly symbolizes your enduring commitment.'
        ]
      }
    ],
    relatedSlugs: ['crochet-bouquet-for-wife', 'crochet-rose-bouquet', 'forever-flowers'],
  },
  {
    slug: 'crochet-bouquet-for-valentines',
    title: 'Crochet Bouquet for Valentine\'s Day | Forever Roses',
    description: 'Shop a crochet bouquet for Valentine\'s Day. Ditch the real roses for a handmade, forever-lasting arrangement she will love.',
    ogDescription: 'Shop a crochet bouquet for Valentine\'s Day. Ditch the real roses for a handmade, forever-lasting arrangement.',
    hero: {
      badge: '💘 Valentine\'s Special',
      heading: 'Crochet Bouquet for Valentine\'s Day',
      subheading: 'This February 14th, give her flowers that will last as long as your love.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Valentine\'s Bouquet',
    gridLabel: 'Valentine\'s bouquets',
    itemListName: 'Crochet Bouquet for Valentine\'s',
    seoArticle: [
      {
        heading: 'Upgrade Your Valentine\'s Gifting',
        level: 'h2',
        paragraphs: [
          'Real roses are beautiful, but they fade in a week. A crochet bouquet for Valentine\'s Day is an incredibly thoughtful, romantic upgrade that she can cherish on her bedside table forever.'
        ]
      }
    ],
    relatedSlugs: ['crochet-rose-bouquet', 'crochet-bouquet-for-girlfriend', 'custom-crochet-bouquet'],
  },
  {
    slug: 'personalized-crochet-bouquet',
    title: 'Personalized Crochet Bouquet | Custom Flower Arrangements',
    description: 'Order a personalized crochet bouquet. Choose your favorite flowers, colors, and add custom initials for a truly unique gift.',
    ogDescription: 'Order a personalized crochet bouquet. Choose your favorite flowers, colors, and add custom initials.',
    hero: {
      badge: '✨ Made For You',
      heading: 'Personalized Crochet Bouquets',
      subheading: 'Create a one-of-a-kind floral arrangement tailored perfectly to their taste.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Personalized Bouquet',
    gridLabel: 'Personalized bouquets',
    itemListName: 'Personalized Crochet Bouquets',
    seoArticle: [
      {
        heading: 'A Truly Unique Gift',
        level: 'h2',
        paragraphs: [
          'A personalized crochet bouquet allows you to combine their favorite colors and flower types into a single, breathtaking arrangement. It\'s the ultimate thoughtful gift.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-bouquet', 'crochet-bouquet-with-initials', 'crochet-flower-bouquets'],
  },
  {
    slug: 'custom-crochet-bouquet',
    title: 'Custom Crochet Bouquet | Bespoke Handmade Flowers',
    description: 'Commission a custom crochet bouquet. Bespoke handmade flower arrangements crafted exactly to your specifications in India.',
    ogDescription: 'Commission a custom crochet bouquet. Bespoke handmade flower arrangements crafted exactly to your specifications.',
    hero: {
      badge: '🎨 Bespoke Crafting',
      heading: 'Custom Crochet Bouquets',
      subheading: 'Have a specific vision? We can bring your dream floral arrangement to life in yarn.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Custom Bouquet',
    gridLabel: 'Custom crochet bouquets',
    itemListName: 'Custom Crochet Bouquets',
    seoArticle: [
      {
        heading: 'Bring Your Vision to Life',
        level: 'h2',
        paragraphs: [
          'Whether you want to recreate a wedding bouquet or combine specific meaningful flowers, our custom crochet bouquet service delivers museum-quality craftsmanship.'
        ]
      }
    ],
    relatedSlugs: ['personalized-crochet-bouquet', 'crochet-flower-bouquets', 'crochet-bouquet-color-guide'],
  },
  {
    slug: 'crochet-bouquet-with-initials',
    title: 'Crochet Bouquet with Initials | Monogrammed Gifts',
    description: 'Add a special touch with a crochet bouquet with initials. Personalized handmade flower gifts with custom lettering and tags.',
    ogDescription: 'Add a special touch with a crochet bouquet with initials. Personalized handmade flower gifts with custom lettering.',
    hero: {
      badge: '🔤 Custom Initials',
      heading: 'Crochet Bouquets with Initials',
      subheading: 'Make it undeniably theirs by adding their initials to a beautiful handmade bouquet.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'keychains'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Bouquet with Initials',
    gridLabel: 'Bouquets with initials',
    itemListName: 'Crochet Bouquet with Initials',
    seoArticle: [
      {
        heading: 'A Personal Touch',
        level: 'h2',
        paragraphs: [
          'A crochet bouquet with initials adds a level of personalization that makes the gift unforgettable. It\'s a highly requested feature for anniversary and wedding gifts.'
        ]
      }
    ],
    relatedSlugs: ['personalized-crochet-bouquet', 'custom-crochet-bouquet', 'crochet-flower-bouquets'],
  },
  {
    slug: 'crochet-bouquet-color-guide',
    title: 'Crochet Bouquet Color Guide | Meanings & Ideas',
    description: 'Explore our crochet bouquet color guide. Learn the meaning behind different flower colors and get inspiration for your custom bouquet.',
    ogDescription: 'Explore our crochet bouquet color guide. Learn the meaning behind different flower colors and get inspiration.',
    hero: {
      badge: '🎨 Color Guide',
      heading: 'Crochet Bouquet Color Guide',
      subheading: 'Discover the perfect color combination and its meaning for your next bouquet.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Color Guide',
    gridLabel: 'Explore bouquet colors',
    itemListName: 'Crochet Bouquet Color Guide',
    seoArticle: [
      {
        heading: 'The Meaning of Colors',
        level: 'h2',
        paragraphs: [
          'Choosing the right colors for your crochet bouquet adds a hidden layer of meaning. Red symbolizes deep love, yellow brings joy and friendship, while pastels offer a gentle, calming aesthetic.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-bouquet', 'crochet-flower-bouquets', 'crochet-rose-bouquet'],
  },
  {
    slug: 'crochet-bouquet-care',
    title: 'Crochet Bouquet Care Guide | How to Maintain Crochet Flowers',
    description: 'Learn how to care for a crochet bouquet. Tips on dusting, placement, and ensuring your handmade flowers last a lifetime.',
    ogDescription: 'Learn how to care for a crochet bouquet. Tips on dusting, placement, and ensuring your handmade flowers last.',
    hero: {
      badge: '✨ Care Instructions',
      heading: 'Crochet Bouquet Care Guide',
      subheading: 'Everything you need to know to keep your handmade flowers looking fresh and beautiful forever.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Care Guide',
    gridLabel: 'Shop easy-care flowers',
    itemListName: 'Crochet Bouquet Care',
    seoArticle: [
      {
        heading: 'Zero Watering, Minimal Maintenance',
        level: 'h2',
        paragraphs: [
          'The best part about crochet flowers is that they require almost no care. To keep them looking their best, simply keep them out of direct, harsh sunlight to prevent yarn fading, and give them a gentle shake to remove dust.'
        ]
      }
    ],
    relatedSlugs: ['crochet-bouquet-cleaning', 'crochet-vs-real-flowers', 'flowers-that-never-wilt'],
  },
  {
    slug: 'crochet-bouquet-cleaning',
    title: 'How to Clean a Crochet Bouquet | Washing Instructions',
    description: 'Wondering how to clean a crochet bouquet? Read our complete guide on safely dusting and spot-cleaning your handmade flowers.',
    ogDescription: 'Wondering how to clean a crochet bouquet? Read our complete guide on safely dusting and spot-cleaning.',
    hero: {
      badge: '🧼 Cleaning Tips',
      heading: 'How to Clean a Crochet Bouquet',
      subheading: 'Simple, safe methods to remove dust and keep your crochet flowers pristine.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Cleaning Guide',
    gridLabel: 'Shop washable flowers',
    itemListName: 'Crochet Bouquet Cleaning',
    seoArticle: [
      {
        heading: 'Gentle Cleaning is Key',
        level: 'h2',
        paragraphs: [
          'If your bouquet gets dusty, a soft-bristled makeup brush or a gentle blast from a hairdryer on the cool setting works wonders. For small stains, lightly dab the area with a damp cloth and mild soap—never soak the flowers.'
        ]
      }
    ],
    relatedSlugs: ['crochet-bouquet-care', 'everlasting-flowers', 'crochet-flower-bouquets'],
  },
  {
    slug: 'crochet-vs-real-flowers',
    title: 'Crochet Flowers vs Real Flowers | Which is Better?',
    description: 'Compare crochet flowers vs real flowers. Discover why handmade crochet bouquets are the more sustainable, lasting, and unique choice.',
    ogDescription: 'Compare crochet flowers vs real flowers. Discover why handmade crochet bouquets are the more sustainable choice.',
    hero: {
      badge: '⚖️ The Comparison',
      heading: 'Crochet vs Real Flowers',
      subheading: 'Why more people are choosing handmade forever-flowers over traditional arrangements.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Crochet vs Real',
    gridLabel: 'Shop the alternative',
    itemListName: 'Crochet vs Real Flowers',
    seoArticle: [
      {
        heading: 'The Ultimate Showdown',
        level: 'h2',
        paragraphs: [
          'Real flowers offer a temporary burst of beauty and natural fragrance, but they wilt within days. Crochet flowers offer a permanent, hypoallergenic, and pet-safe alternative that acts as a lasting piece of art.'
        ]
      }
    ],
    relatedSlugs: ['alternative-to-real-flowers', 'crochet-vs-artificial-flowers', 'flowers-that-last-forever'],
  },
  {
    slug: 'crochet-vs-artificial-flowers',
    title: 'Crochet vs Artificial Flowers | Why Handmade is Better',
    description: 'Crochet vs artificial flowers: what\'s the difference? Learn why handcrafted crochet bouquets offer superior texture, charm, and quality over plastic flowers.',
    ogDescription: 'Crochet vs artificial flowers: what\'s the difference? Learn why handcrafted crochet bouquets offer superior texture.',
    hero: {
      badge: '🧶 Handmade Quality',
      heading: 'Crochet vs Artificial Flowers',
      subheading: 'Discover the charm, quality, and artistry that sets crochet flowers apart from plastic.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Crochet vs Artificial',
    gridLabel: 'Shop handmade quality',
    itemListName: 'Crochet vs Artificial Flowers',
    seoArticle: [
      {
        heading: 'Handmade Art vs Mass Production',
        level: 'h2',
        paragraphs: [
          'While plastic or silk artificial flowers are mass-produced in factories, every single crochet flower is hand-stitched by an artisan. Crochet flowers offer a unique, cozy texture and a level of care that plastic simply cannot replicate.'
        ]
      }
    ],
    relatedSlugs: ['crochet-vs-real-flowers', 'alternative-to-real-flowers', 'everlasting-flowers'],
  },

  // ═══════════════════════════════════════════
  // TOYS & AMIGURUMI
  // ═══════════════════════════════════════════
  {
    slug: 'amigurumi',
    title: 'Amigurumi | Handmade Crochet Plushies & Toys',
    description: 'Shop adorable amigurumi toys online. Handcrafted crochet plushies, animals, and cute characters made with premium, baby-safe yarn.',
    ogDescription: 'Shop adorable amigurumi toys online. Handcrafted crochet plushies, animals, and cute characters.',
    hero: {
      badge: '🧸 Amigurumi',
      heading: 'Handmade Amigurumi Toys',
      subheading: 'Discover our collection of irresistibly cute, handcrafted crochet plushies and characters.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Amigurumi',
    gridLabel: 'Shop amigurumi',
    itemListName: 'Amigurumi Collection',
    seoArticle: [
      {
        heading: 'What is Amigurumi?',
        level: 'h2',
        paragraphs: [
          'Amigurumi is the Japanese art of knitting or crocheting small, stuffed yarn creatures. Our amigurumi toys are meticulously handmade, offering unique personalities and unmatched cuteness that you won\'t find in mass-produced plushies.'
        ]
      }
    ],
    relatedSlugs: ['crochet-plushies', 'amigurumi-gifts', 'personalized-amigurumi'],
  },
  {
    slug: 'crochet-plushies',
    title: 'Crochet Plushies | Cute Handmade Stuffed Toys',
    description: 'Find the cutest crochet plushies online. Super soft handmade stuffed toys perfect for gifting to kids, girlfriends, or as desk companions.',
    ogDescription: 'Find the cutest crochet plushies online. Super soft handmade stuffed toys perfect for gifting.',
    hero: {
      badge: '✨ Super Soft',
      heading: 'Crochet Plushies',
      subheading: 'Soft, cuddly, and handmade with love. Find your new favorite companion.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Crochet Plushies',
    gridLabel: 'Shop crochet plushies',
    itemListName: 'Crochet Plushies',
    seoArticle: [
      {
        heading: 'Handmade with Love',
        level: 'h2',
        paragraphs: [
          'Every crochet plushie is carefully handcrafted by our artisans. From cute animals to quirky characters, these plushies are designed to bring a smile to anyone\'s face.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi', 'crochet-toys', 'amigurumi-for-girlfriend'],
  },
  {
    slug: 'crochet-toys',
    title: 'Crochet Toys | Handmade Safe Toys for Kids',
    description: 'Shop handmade crochet toys for babies and kids. Soft, safe, and durable amigurumi toys crafted with premium yarn.',
    ogDescription: 'Shop handmade crochet toys for babies and kids. Soft, safe, and durable amigurumi toys.',
    hero: {
      badge: '🧸 Playtime',
      heading: 'Handmade Crochet Toys',
      subheading: 'Safe, soft, and durable crochet toys perfect for children and babies.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Crochet Toys',
    gridLabel: 'Shop crochet toys',
    itemListName: 'Crochet Toys',
    seoArticle: [
      {
        heading: 'Safe and Soft for Little Ones',
        level: 'h2',
        paragraphs: [
          'Our crochet toys are made with high-quality, hypoallergenic yarn, making them perfectly safe for babies and toddlers. They are durable, washable, and incredibly soft.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi-for-kids', 'crochet-animal-toys', 'amigurumi-care-guide'],
  },
  {
    slug: 'crochet-teddy-bear',
    title: 'Crochet Teddy Bear | Handmade Stuffed Bears',
    description: 'Buy a classic crochet teddy bear. Adorable, handmade stuffed bears perfect for birthdays, baby showers, and romantic gifts.',
    ogDescription: 'Buy a classic crochet teddy bear. Adorable, handmade stuffed bears perfect for any occasion.',
    hero: {
      badge: '🐻 Classic Gift',
      heading: 'Crochet Teddy Bears',
      subheading: 'A timeless, handmade classic. Gift a soft and cuddly crochet teddy bear.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Teddy Bears',
    gridLabel: 'Shop teddy bears',
    itemListName: 'Crochet Teddy Bears',
    seoArticle: [
      {
        heading: 'A Timeless Classic',
        level: 'h2',
        paragraphs: [
          'You can never go wrong with a teddy bear. A handmade crochet teddy bear adds a layer of artisanal charm to this classic gift, making it a perfect keepsake.'
        ]
      }
    ],
    relatedSlugs: ['crochet-plushies', 'amigurumi-gifts', 'crochet-animal-toys'],
  },
  {
    slug: 'crochet-bunny',
    title: 'Crochet Bunny | Cute Handmade Bunny Plushies',
    description: 'Shop cute crochet bunny plushies. Soft, handmade amigurumi rabbits perfect for Easter, babies, or anyone who loves bunnies.',
    ogDescription: 'Shop cute crochet bunny plushies. Soft, handmade amigurumi rabbits.',
    hero: {
      badge: '🐰 So Cute',
      heading: 'Crochet Bunny Plushies',
      subheading: 'Hop into happiness with our adorable handmade crochet bunnies.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Crochet Bunny',
    gridLabel: 'Shop bunny plushies',
    itemListName: 'Crochet Bunny Plushies',
    seoArticle: [
      {
        heading: 'Perfect for Gifting',
        level: 'h2',
        paragraphs: [
          'With their long floppy ears and round little bodies, crochet bunnies are undeniably cute. They make fantastic baby shower gifts, Easter surprises, or sweet romantic gestures.'
        ]
      }
    ],
    relatedSlugs: ['crochet-animal-toys', 'amigurumi-for-kids', 'crochet-plushies'],
  },
  {
    slug: 'crochet-strawberry-plush',
    title: 'Crochet Strawberry Plush | Cute Fruit Amigurumi',
    description: 'Find the adorable crochet strawberry plush. A cute, handmade amigurumi fruit toy perfect for keychains, desk decor, or gifting.',
    ogDescription: 'Find the adorable crochet strawberry plush. A cute, handmade amigurumi fruit toy.',
    hero: {
      badge: '🍓 Berry Cute',
      heading: 'Crochet Strawberry Plushies',
      subheading: 'Sweeten someone\'s day with an adorable handmade crochet strawberry.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Strawberry Plush',
    gridLabel: 'Shop strawberries',
    itemListName: 'Crochet Strawberry Plushies',
    seoArticle: [
      {
        heading: 'Sweet and Simple',
        level: 'h2',
        paragraphs: [
          'Food amigurumi is incredibly popular right now! A crochet strawberry plush is a small, sweet gift that works perfectly as a keychain or a cute desk accessory.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi', 'crochet-character-plushies', 'amigurumi-gifts'],
  },
  {
    slug: 'crochet-animal-toys',
    title: 'Crochet Animal Toys | Handmade Zoo & Safari Plushies',
    description: 'Shop handmade crochet animal toys. Discover cute amigurumi cats, dogs, frogs, and safari animals crafted from soft yarn.',
    ogDescription: 'Shop handmade crochet animal toys. Discover cute amigurumi cats, dogs, frogs, and safari animals.',
    hero: {
      badge: '🐶 Animal Friends',
      heading: 'Crochet Animal Toys',
      subheading: 'Discover a zoo of cute, cuddly, and handmade crochet animal plushies.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Animal Toys',
    gridLabel: 'Shop animal toys',
    itemListName: 'Crochet Animal Toys',
    seoArticle: [
      {
        heading: 'Collect Them All',
        level: 'h2',
        paragraphs: [
          'From tiny frogs to cuddly bears, our crochet animal toys are bursting with personality. They make wonderful gifts for animal lovers of all ages.'
        ]
      }
    ],
    relatedSlugs: ['crochet-bunny', 'crochet-teddy-bear', 'crochet-toys'],
  },
  {
    slug: 'crochet-character-plushies',
    title: 'Crochet Character Plushies | Custom Anime & Cartoon Toys',
    description: 'Discover crochet character plushies. Handmade amigurumi versions of your favorite anime, gaming, and cartoon characters.',
    ogDescription: 'Discover crochet character plushies. Handmade amigurumi versions of your favorite anime, gaming, and cartoon characters.',
    hero: {
      badge: '👾 Fan Favorites',
      heading: 'Crochet Character Plushies',
      subheading: 'Your favorite characters, reimagined in soft, handmade crochet form.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Character Plushies',
    gridLabel: 'Shop character toys',
    itemListName: 'Crochet Character Plushies',
    seoArticle: [
      {
        heading: 'Geeky and Cute',
        level: 'h2',
        paragraphs: [
          'Whether you love anime, video games, or movies, a crochet character plushie is a unique piece of fan merch that shows off your interests in an adorable way.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-plushie', 'amigurumi-gifts', 'personalized-amigurumi'],
  },
  {
    slug: 'amigurumi-gifts',
    title: 'Amigurumi Gifts | Cute Crochet Gift Ideas',
    description: 'Find the perfect amigurumi gifts. Unique, handcrafted crochet plushies and keychains that make incredibly thoughtful presents.',
    ogDescription: 'Find the perfect amigurumi gifts. Unique, handcrafted crochet plushies and keychains.',
    hero: {
      badge: '🎁 Perfect Presents',
      heading: 'Amigurumi Gift Ideas',
      subheading: 'Give a gift that brings an instant smile. Shop our cute amigurumi collection.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Amigurumi Gifts',
    gridLabel: 'Amigurumi gift ideas',
    itemListName: 'Amigurumi Gifts',
    seoArticle: [
      {
        heading: 'Why Amigurumi Makes the Best Gift',
        level: 'h2',
        paragraphs: [
          'Amigurumi gifts are universally loved because they are unique, handmade, and undeniably cute. Unlike mass-produced items, a crochet plushie feels personal and special.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi-for-girlfriend', 'amigurumi-birthday-gifts', 'personalized-amigurumi'],
  },
  {
    slug: 'amigurumi-for-kids',
    title: 'Amigurumi for Kids | Safe Handmade Crochet Toys',
    description: 'Shop amigurumi for kids. Safe, durable, and adorable handmade crochet toys that make perfect gifts for toddlers and children.',
    ogDescription: 'Shop amigurumi for kids. Safe, durable, and adorable handmade crochet toys.',
    hero: {
      badge: '👶 Kid Approved',
      heading: 'Amigurumi for Kids',
      subheading: 'Safe, soft, and bursting with imagination. Perfect handmade toys for little ones.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Amigurumi for Kids',
    gridLabel: 'Amigurumi for kids',
    itemListName: 'Amigurumi for Kids',
    seoArticle: [
      {
        heading: 'Safety and Durability',
        level: 'h2',
        paragraphs: [
          'When buying toys for children, safety is paramount. Our amigurumi for kids is tightly crocheted with secure safety eyes, ensuring they are durable enough for playtime and soft enough for bedtime.'
        ]
      }
    ],
    relatedSlugs: ['crochet-toys', 'crochet-animal-toys', 'how-to-wash-crochet-plushies'],
  },
  {
    slug: 'amigurumi-for-adults',
    title: 'Amigurumi for Adults | Cute Desk Decor & Keepsakes',
    description: 'Discover amigurumi for adults. Adorable handmade crochet characters and desk companions perfect for gifting to grown-ups.',
    ogDescription: 'Discover amigurumi for adults. Adorable handmade crochet characters and desk companions.',
    hero: {
      badge: '🪴 Desk Buddies',
      heading: 'Amigurumi for Adults',
      subheading: 'You never outgrow cute. Discover handmade crochet companions for your desk or car.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Amigurumi for Adults',
    gridLabel: 'Amigurumi for adults',
    itemListName: 'Amigurumi for Adults',
    seoArticle: [
      {
        heading: 'Cute Decor for Grown-Ups',
        level: 'h2',
        paragraphs: [
          'Who says toys are just for kids? Amigurumi for adults serves as fantastic desk decor, stress-relievers, and fun car dashboard companions that add a little joy to everyday life.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi-for-boyfriend', 'amigurumi-for-girlfriend', 'crochet-character-plushies'],
  },
  {
    slug: 'amigurumi-for-girlfriend',
    title: 'Amigurumi for Girlfriend | Cute Romantic Crochet Gifts',
    description: 'Surprise her with amigurumi for your girlfriend. Cute handmade crochet animals, plushies, and keychains she will adore.',
    ogDescription: 'Surprise her with amigurumi for your girlfriend. Cute handmade crochet animals and plushies.',
    hero: {
      badge: '❤️ For Her',
      heading: 'Amigurumi for Girlfriend',
      subheading: 'Get her something incredibly cute and undeniably thoughtful.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Girlfriend',
    gridLabel: 'Amigurumi for girlfriend',
    itemListName: 'Amigurumi for Girlfriend',
    seoArticle: [
      {
        heading: 'The Cutest Gift Idea',
        level: 'h2',
        paragraphs: [
          'If she loves cute things, an amigurumi toy is a guaranteed win. Whether it\'s a tiny crochet frog or a cute bunny, it shows you put thought into finding something handmade and special.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi-valentines-gifts', 'crochet-plushies', 'crochet-bunny'],
  },
  {
    slug: 'amigurumi-for-boyfriend',
    title: 'Amigurumi for Boyfriend | Fun Crochet Gifts for Him',
    description: 'Shop amigurumi for your boyfriend. Fun handmade crochet character keychains, gaming plushies, and unique gifts for him.',
    ogDescription: 'Shop amigurumi for your boyfriend. Fun handmade crochet character keychains and gaming plushies.',
    hero: {
      badge: '🎮 For Him',
      heading: 'Amigurumi for Boyfriend',
      subheading: 'Surprise him with a cool, handmade crochet character for his desk or keys.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Boyfriend',
    gridLabel: 'Amigurumi for boyfriend',
    itemListName: 'Amigurumi for Boyfriend',
    seoArticle: [
      {
        heading: 'Unique and Personal Gifts',
        level: 'h2',
        paragraphs: [
          'An amigurumi character from his favorite anime or video game makes a fantastic, personal gift for your boyfriend. It\'s a fun desk accessory that he\'ll definitely show off.'
        ]
      }
    ],
    relatedSlugs: ['crochet-character-plushies', 'personalized-amigurumi', 'amigurumi-gifts'],
  },
  {
    slug: 'amigurumi-birthday-gifts',
    title: 'Amigurumi Birthday Gifts | Unique Handmade Plushies',
    description: 'Find unique amigurumi birthday gifts. Handcrafted crochet plushies and animals that make perfect, unforgettable birthday surprises.',
    ogDescription: 'Find unique amigurumi birthday gifts. Handcrafted crochet plushies and animals.',
    hero: {
      badge: '🎂 Birthday Surprises',
      heading: 'Amigurumi Birthday Gifts',
      subheading: 'Make their birthday extra special with a cute, handcrafted amigurumi toy.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Birthday Gifts',
    gridLabel: 'Birthday amigurumi',
    itemListName: 'Amigurumi Birthday Gifts',
    seoArticle: [
      {
        heading: 'A Memorable Birthday Surprise',
        level: 'h2',
        paragraphs: [
          'Skip the generic store-bought presents and opt for an amigurumi birthday gift. These handmade crochet toys are memorable keepsakes that they will cherish long after their birthday is over.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi-gifts', 'crochet-plushies', 'personalized-amigurumi'],
  },
  {
    slug: 'amigurumi-valentines-gifts',
    title: 'Amigurumi Valentine\'s Gifts | Cute Romantic Crochet',
    description: 'Shop cute amigurumi Valentine\'s Day gifts. Handmade crochet animals holding hearts, cute plushies, and romantic keychains.',
    ogDescription: 'Shop cute amigurumi Valentine\'s Day gifts. Handmade crochet animals holding hearts and romantic keychains.',
    hero: {
      badge: '💘 Valentine\'s Special',
      heading: 'Amigurumi Valentine\'s Gifts',
      subheading: 'Say "I love you" with an irresistibly cute, handmade crochet plushie.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Valentine\'s Gifts',
    gridLabel: 'Valentine\'s amigurumi',
    itemListName: 'Amigurumi Valentine\'s Gifts',
    seoArticle: [
      {
        heading: 'Cute and Romantic',
        level: 'h2',
        paragraphs: [
          'An amigurumi Valentine\'s gift is perfect for expressing your love in a fun, cute way. Pair a handmade crochet plushie with a bouquet of crochet flowers for the ultimate romantic gesture.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi-for-girlfriend', 'amigurumi-for-boyfriend', 'amigurumi-gifts'],
  },
  {
    slug: 'personalized-amigurumi',
    title: 'Personalized Amigurumi | Custom Crochet Toys',
    description: 'Order personalized amigurumi. Custom handmade crochet toys featuring specific colors, accessories, and unique details.',
    ogDescription: 'Order personalized amigurumi. Custom handmade crochet toys featuring specific colors and unique details.',
    hero: {
      badge: '✨ Made For You',
      heading: 'Personalized Amigurumi',
      subheading: 'Add a personal touch with customized colors and details on our crochet toys.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Personalized Amigurumi',
    gridLabel: 'Personalized toys',
    itemListName: 'Personalized Amigurumi',
    seoArticle: [
      {
        heading: 'Tailored to Perfection',
        level: 'h2',
        paragraphs: [
          'Personalized amigurumi allows you to tweak colors, add small accessories like hats or scarves, and create a truly one-of-a-kind crochet toy that perfectly matches the recipient\'s personality.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-plushie', 'amigurumi-gifts', 'crochet-character-plushies'],
  },
  {
    slug: 'custom-crochet-plushie',
    title: 'Custom Crochet Plushie | Bespoke Amigurumi Toys',
    description: 'Commission a custom crochet plushie. Turn your pets, characters, or drawings into bespoke, handmade amigurumi toys.',
    ogDescription: 'Commission a custom crochet plushie. Turn your pets, characters, or drawings into bespoke, handmade amigurumi toys.',
    hero: {
      badge: '🎨 Bespoke Crafting',
      heading: 'Custom Crochet Plushies',
      subheading: 'We can bring your ideas to life! Commission a unique, handcrafted amigurumi.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Custom Plushie',
    gridLabel: 'Custom amigurumi',
    itemListName: 'Custom Crochet Plushies',
    seoArticle: [
      {
        heading: 'From Idea to Reality',
        level: 'h2',
        paragraphs: [
          'Want a crochet version of your pet dog or a specific video game character? A custom crochet plushie commission allows our artisans to design and craft a bespoke toy just for you.'
        ]
      }
    ],
    relatedSlugs: ['personalized-amigurumi', 'crochet-character-plushies', 'amigurumi'],
  },
  {
    slug: 'amigurumi-care-guide',
    title: 'Amigurumi Care Guide | How to Maintain Crochet Toys',
    description: 'Read our amigurumi care guide. Tips on washing, dusting, and preserving the shape of your handmade crochet plushies.',
    ogDescription: 'Read our amigurumi care guide. Tips on washing, dusting, and preserving the shape of your handmade crochet plushies.',
    hero: {
      badge: '✨ Care Tips',
      heading: 'Amigurumi Care Guide',
      subheading: 'Everything you need to know to keep your crochet toys looking perfect for years.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Care Guide',
    gridLabel: 'Shop easy-care amigurumi',
    itemListName: 'Amigurumi Care',
    seoArticle: [
      {
        heading: 'Preserving the Cuteness',
        level: 'h2',
        paragraphs: [
          'Amigurumi is durable, but proper care ensures they last a lifetime. Keep them out of harsh sunlight to prevent the yarn from fading, and avoid pulling forcefully on attached parts like ears or limbs.'
        ]
      }
    ],
    relatedSlugs: ['how-to-wash-crochet-plushies', 'amigurumi-for-kids', 'crochet-toys'],
  },
  {
    slug: 'how-to-wash-crochet-plushies',
    title: 'How to Wash Crochet Plushies | Cleaning Amigurumi',
    description: 'Learn how to wash crochet plushies safely. Step-by-step instructions for spot cleaning and hand washing your amigurumi toys.',
    ogDescription: 'Learn how to wash crochet plushies safely. Step-by-step instructions for spot cleaning and hand washing.',
    hero: {
      badge: '🧼 Wash Guide',
      heading: 'How to Wash Crochet Plushies',
      subheading: 'The safest ways to clean and dry your amigurumi toys without ruining their shape.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Washing Guide',
    gridLabel: 'Shop washable toys',
    itemListName: 'How to Wash Amigurumi',
    seoArticle: [
      {
        heading: 'Spot Cleaning is Best',
        level: 'h2',
        paragraphs: [
          'For minor dirt, always spot clean your crochet plushies with a damp cloth and mild soap. If a full wash is necessary, gently hand wash them in lukewarm water, squeeze out excess water (never wring!), and air dry flat.'
        ]
      }
    ],
    relatedSlugs: ['amigurumi-care-guide', 'amigurumi-for-kids', 'amigurumi'],
  },
  {
    slug: 'amigurumi-vs-plush-toys',
    title: 'Amigurumi vs Plush Toys | Why Handmade Crochet is Better',
    description: 'Amigurumi vs plush toys: compare the differences. Discover why handcrafted crochet toys offer superior quality, durability, and uniqueness.',
    ogDescription: 'Amigurumi vs plush toys: compare the differences. Discover why handcrafted crochet toys offer superior quality.',
    hero: {
      badge: '⚖️ The Comparison',
      heading: 'Amigurumi vs Plush Toys',
      subheading: 'Why more people are choosing artisanal crochet over mass-produced stuffed animals.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Amigurumi vs Plush',
    gridLabel: 'Shop handmade toys',
    itemListName: 'Amigurumi vs Plush Toys',
    seoArticle: [
      {
        heading: 'Handmade Quality You Can Feel',
        level: 'h2',
        paragraphs: [
          'Mass-produced plush toys are made of synthetic fabrics glued and stitched in factories. Amigurumi, on the other hand, is slowly and meticulously crafted by hand, stitch by stitch, resulting in a toy with a beautiful texture, solid structure, and immense artisanal value.'
        ]
      }
    ],
    relatedSlugs: ['crochet-plushies', 'amigurumi-for-kids', 'amigurumi'],
  },

  // ═══════════════════════════════════════════
  // CUSTOM & PERSONALIZED
  // ═══════════════════════════════════════════
  {
    slug: 'custom-crochet-gifts',
    title: 'Custom Crochet Gifts | Personalized Handmade Gifts',
    description: 'Order custom crochet gifts online. Unique, personalized handmade crochet bouquets, plushies, and keychains crafted just for you.',
    ogDescription: 'Order custom crochet gifts online. Unique, personalized handmade crochet bouquets, plushies, and keychains.',
    hero: {
      badge: '🎨 Bespoke Gifting',
      heading: 'Custom Crochet Gifts',
      subheading: 'Turn your imagination into reality. Order a one-of-a-kind handmade gift.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Custom Gifts',
    gridLabel: 'Shop custom gifts',
    itemListName: 'Custom Crochet Gifts',
    seoArticle: [
      {
        heading: 'Why Choose Custom?',
        level: 'h2',
        paragraphs: [
          'A custom crochet gift is the ultimate way to show someone you care. By personalizing the colors, shapes, and details, you are giving a gift that literally no one else in the world has.'
        ]
      }
    ],
    relatedSlugs: ['personalized-crochet-gifts', 'custom-order-process', 'design-your-crochet-gift'],
  },
  {
    slug: 'personalized-crochet-gifts',
    title: 'Personalized Crochet Gifts | Custom Handmade Presents',
    description: 'Shop personalized crochet gifts. Add initials, choose custom colors, and create unique handmade presents for your loved ones.',
    ogDescription: 'Shop personalized crochet gifts. Add initials, choose custom colors, and create unique handmade presents.',
    hero: {
      badge: '✨ Made For You',
      heading: 'Personalized Crochet Gifts',
      subheading: 'Add a personal touch with initials, names, and customized colors.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Personalized Gifts',
    gridLabel: 'Shop personalized gifts',
    itemListName: 'Personalized Crochet Gifts',
    seoArticle: [
      {
        heading: 'Make It Theirs',
        level: 'h2',
        paragraphs: [
          'Personalized gifts speak volumes. Adding a simple initial tag or their favorite color to a crochet bouquet or keychain elevates a great gift into a treasured keepsake.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-gifts', 'crochet-gifts-with-initials', 'crochet-gifts-with-name'],
  },
  {
    slug: 'custom-crochet',
    title: 'Custom Crochet | Commission Bespoke Handmade Items',
    description: 'Looking for custom crochet? Commission our artisans for bespoke handmade crochet flowers, toys, and unique gifts in India.',
    ogDescription: 'Looking for custom crochet? Commission our artisans for bespoke handmade crochet flowers, toys, and unique gifts.',
    hero: {
      badge: '🧶 Artisan Crafting',
      heading: 'Custom Crochet Commissions',
      subheading: 'If you can dream it, we can crochet it. Start your custom commission today.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Custom Crochet',
    gridLabel: 'Custom crochet ideas',
    itemListName: 'Custom Crochet Collection',
    seoArticle: [
      {
        heading: 'The Art of Bespoke Crochet',
        level: 'h2',
        paragraphs: [
          'Custom crochet is where our artisans truly shine. Whether it\'s recreating a beloved pet in yarn or crafting a floral arrangement to match a wedding theme, our bespoke service delivers museum-quality results.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-gifts', 'custom-order-process', 'design-your-crochet-gift'],
  },
  {
    slug: 'personalized-crochet-keychain',
    title: 'Personalized Crochet Keychain | Custom Bag Charms',
    description: 'Order a personalized crochet keychain. Cute custom amigurumi keychains with your choice of characters and initials.',
    ogDescription: 'Order a personalized crochet keychain. Cute custom amigurumi keychains with your choice of characters and initials.',
    hero: {
      badge: '🔑 Custom Accessories',
      heading: 'Personalized Crochet Keychains',
      subheading: 'Carry a piece of handmade joy everywhere you go.',
    },
    productFilter: { type: 'category', slugs: ['keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Custom Keychains',
    gridLabel: 'Shop custom keychains',
    itemListName: 'Personalized Crochet Keychains',
    seoArticle: [
      {
        heading: 'Small Gift, Big Impact',
        level: 'h2',
        paragraphs: [
          'A personalized crochet keychain is an affordable yet highly thoughtful gift. Add their initials to a tiny crochet frog or custom-colored flower to brighten up their daily commute.'
        ]
      }
    ],
    relatedSlugs: ['crochet-gifts-with-initials', 'custom-crochet-gifts', 'personalized-crochet-gifts'],
  },
  {
    slug: 'crochet-gifts-with-name',
    title: 'Crochet Gifts with Name | Monogrammed Handmade Presents',
    description: 'Find unique crochet gifts with names. Custom handmade bouquets and plushies featuring personalized name tags and embroidery.',
    ogDescription: 'Find unique crochet gifts with names. Custom handmade bouquets and plushies featuring personalized name tags.',
    hero: {
      badge: '🔤 Named Gifts',
      heading: 'Crochet Gifts With Name',
      subheading: 'Give a gift that has their name written all over it.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Named Gifts',
    gridLabel: 'Shop named gifts',
    itemListName: 'Crochet Gifts With Name',
    seoArticle: [
      {
        heading: 'The Magic of a Name',
        level: 'h2',
        paragraphs: [
          'There is nothing sweeter than receiving a gift made specifically for you. Adding a personalized name tag to a crochet bouquet or toy creates an unforgettable gifting experience.'
        ]
      }
    ],
    relatedSlugs: ['personalized-crochet-gifts', 'crochet-gifts-with-initials', 'custom-crochet-gifts'],
  },
  {
    slug: 'crochet-gifts-with-initials',
    title: 'Crochet Gifts with Initials | Monogrammed Custom Gifts',
    description: 'Shop beautiful crochet gifts with initials. Monogrammed handmade bouquets, keychains, and custom accessories.',
    ogDescription: 'Shop beautiful crochet gifts with initials. Monogrammed handmade bouquets, keychains, and custom accessories.',
    hero: {
      badge: '🔠 Initial Elegance',
      heading: 'Crochet Gifts With Initials',
      subheading: 'Subtle, elegant, and entirely personalized for them.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Initials Gifts',
    gridLabel: 'Shop monogrammed gifts',
    itemListName: 'Crochet Gifts With Initials',
    seoArticle: [
      {
        heading: 'Elegant Personalization',
        level: 'h2',
        paragraphs: [
          'Initials offer a sleek, elegant way to personalize a gift. A custom crochet flower bouquet paired with a delicate wooden tag bearing their initials is a classy choice for anniversaries.'
        ]
      }
    ],
    relatedSlugs: ['crochet-gifts-with-name', 'personalized-crochet-keychain', 'personalized-crochet-gifts'],
  },
  {
    slug: 'custom-color-crochet-gifts',
    title: 'Custom Color Crochet Gifts | Pick Your Palette',
    description: 'Design custom color crochet gifts. Choose the perfect yarn palette for your handmade bouquets, toys, and home decor.',
    ogDescription: 'Design custom color crochet gifts. Choose the perfect yarn palette for your handmade bouquets and toys.',
    hero: {
      badge: '🎨 Your Palette',
      heading: 'Custom Color Crochet Gifts',
      subheading: 'Match their favorite aesthetic with customized yarn colors.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Custom Colors',
    gridLabel: 'Custom color gifts',
    itemListName: 'Custom Color Crochet Gifts',
    seoArticle: [
      {
        heading: 'Color is Everything',
        level: 'h2',
        paragraphs: [
          'Whether you want a pastel goth bunny or a bouquet matching specific wedding colors, our custom color crochet service allows you to dictate exactly how your gift looks.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-gifts', 'design-your-crochet-gift', 'personalized-crochet-gifts'],
  },
  {
    slug: 'custom-crochet-gifts-for-couples',
    title: 'Custom Crochet Gifts for Couples | Personalized Pair Gifts',
    description: 'Find custom crochet gifts for couples. Personalized matching keychains, anniversary bouquets, and bespoke couple presents.',
    ogDescription: 'Find custom crochet gifts for couples. Personalized matching keychains and anniversary bouquets.',
    hero: {
      badge: '💕 Couple Goals',
      heading: 'Custom Crochet Gifts for Couples',
      subheading: 'Celebrate your unique bond with a completely customized matching gift.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'flower-bouquets'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Couples Custom',
    gridLabel: 'Custom couple gifts',
    itemListName: 'Custom Crochet Gifts for Couples',
    seoArticle: [
      {
        heading: 'Matching Handmade Gifts',
        level: 'h2',
        paragraphs: [
          'Custom matching crochet keychains are incredibly popular for couples. Choose your favorite characters or matching colors to create a daily reminder of your partner.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-wedding-gifts', 'custom-crochet-gifts', 'personalized-crochet-keychain'],
  },
  {
    slug: 'custom-crochet-wedding-gifts',
    title: 'Custom Crochet Wedding Gifts | Bespoke Bridal Flowers',
    description: 'Order custom crochet wedding gifts. Bespoke bridal bouquets, forever-lasting wedding decor, and personalized couple gifts.',
    ogDescription: 'Order custom crochet wedding gifts. Bespoke bridal bouquets, forever-lasting wedding decor, and personalized couple gifts.',
    hero: {
      badge: '💍 Wedding Specials',
      heading: 'Custom Crochet Wedding Gifts',
      subheading: 'Unique, forever-lasting crochet gifts and decor for the perfect wedding.',
    },
    productFilter: { type: 'category', slugs: ['flower-bouquets', 'flower-pots'] },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Wedding Custom',
    gridLabel: 'Custom wedding gifts',
    itemListName: 'Custom Crochet Wedding Gifts',
    seoArticle: [
      {
        heading: 'Alternative Bridal Bouquets',
        level: 'h2',
        paragraphs: [
          'More brides are choosing custom crochet bouquets over real flowers because they serve as a permanent keepsake of their special day. We can match any wedding color palette!'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-gifts-for-couples', 'custom-color-crochet-gifts', 'custom-crochet-gifts'],
  },
  {
    slug: 'custom-crochet-baby-gifts',
    title: 'Custom Crochet Baby Gifts | Personalized Nursery Toys',
    description: 'Shop custom crochet baby gifts. Personalized safe amigurumi toys, soft rattles, and bespoke baby shower presents.',
    ogDescription: 'Shop custom crochet baby gifts. Personalized safe amigurumi toys and bespoke baby shower presents.',
    hero: {
      badge: '🍼 Baby Shower',
      heading: 'Custom Crochet Baby Gifts',
      subheading: 'Welcome the little one with a completely personalized, safe, and soft handmade toy.',
    },
    productFilter: { type: 'category', slugs: ['toys'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Custom Baby Gifts',
    gridLabel: 'Custom baby gifts',
    itemListName: 'Custom Crochet Baby Gifts',
    seoArticle: [
      {
        heading: 'Safe, Soft, and Special',
        level: 'h2',
        paragraphs: [
          'Our custom crochet baby gifts are made with ultra-soft, hypoallergenic yarn. Personalize a bunny or bear in the nursery\'s theme colors for the ultimate baby shower gift.'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-gifts', 'personalized-crochet-gifts', 'design-your-crochet-gift'],
  },
  {
    slug: 'custom-crochet-bulk-orders',
    title: 'Custom Crochet Bulk Orders | Corporate & Return Gifts',
    description: 'Inquire about custom crochet bulk orders. Handmade return gifts for weddings, corporate gifting, and large events in India.',
    ogDescription: 'Inquire about custom crochet bulk orders. Handmade return gifts for weddings and corporate gifting.',
    hero: {
      badge: '📦 Bulk Orders',
      heading: 'Custom Crochet Bulk Orders',
      subheading: 'Make your event unforgettable with handmade crochet return gifts.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bulk Orders',
    gridLabel: 'Bulk order ideas',
    itemListName: 'Custom Crochet Bulk Orders',
    seoArticle: [
      {
        heading: 'Unique Return Gifts',
        level: 'h2',
        paragraphs: [
          'Looking for unique return gifts for a wedding, baby shower, or corporate event? We accept custom bulk orders for keychains, mini flowers, and small amigurumi at wholesale pricing.'
        ]
      }
    ],
    relatedSlugs: ['custom-order-process', 'custom-crochet', 'custom-crochet-gifts'],
  },
  {
    slug: 'design-your-crochet-gift',
    title: 'Design Your Crochet Gift | Create Bespoke Handmade Items',
    description: 'Design your crochet gift from scratch. Work with our artisans to create a completely bespoke handmade toy or bouquet.',
    ogDescription: 'Design your crochet gift from scratch. Work with our artisans to create a completely bespoke handmade toy.',
    hero: {
      badge: '✍️ Be The Designer',
      heading: 'Design Your Crochet Gift',
      subheading: 'You dream it, we make it. Step into the designer seat and create something magical.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Design Your Gift',
    gridLabel: 'Custom design ideas',
    itemListName: 'Design Your Crochet Gift',
    seoArticle: [
      {
        heading: 'A Collaborative Process',
        level: 'h2',
        paragraphs: [
          'When you design your crochet gift with us, it\'s a true collaboration. You pick the flowers, the colors, the wrapping, and the accessories, and our expert crafters bring your vision to life.'
        ]
      }
    ],
    relatedSlugs: ['custom-color-crochet-gifts', 'custom-order-process', 'custom-crochet-gifts'],
  },
  {
    slug: 'custom-order-process',
    title: 'Custom Crochet Order Process | How to Commission Us',
    description: 'Learn about our custom crochet order process. Step-by-step guide on how to commission bespoke handmade gifts from Anuki Crochet.',
    ogDescription: 'Learn about our custom crochet order process. Step-by-step guide on how to commission bespoke handmade gifts.',
    hero: {
      badge: 'ℹ️ How It Works',
      heading: 'Our Custom Order Process',
      subheading: 'Everything you need to know about commissioning a bespoke crochet masterpiece.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Order Process',
    gridLabel: 'Shop custom capabilities',
    itemListName: 'Custom Order Process',
    seoArticle: [
      {
        heading: 'Simple and Transparent',
        level: 'h2',
        paragraphs: [
          'Our custom order process is simple. You reach out with your idea or reference photo, we discuss colors and pricing, and once approved, our artisans get to work. Regular updates ensure you love the final product!'
        ]
      }
    ],
    relatedSlugs: ['custom-crochet-bulk-orders', 'design-your-crochet-gift', 'custom-crochet'],
  },

  // ═══════════════════════════════════════════
  // BULK & CORPORATE GIFTS
  // ═══════════════════════════════════════════
  {
    slug: 'bulk-orders',
    title: 'Bulk Handmade Gifts | Wholesale Crochet Orders',
    description: 'Inquire about bulk handmade gifts and wholesale crochet orders. Perfect for events, businesses, and large gifting needs.',
    ogDescription: 'Inquire about bulk handmade gifts and wholesale crochet orders.',
    hero: {
      badge: '📦 Bulk Pricing',
      heading: 'Bulk Handmade Gifts',
      subheading: 'Special wholesale pricing for large orders. Perfect for events and corporate gifting.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bulk Orders',
    gridLabel: 'Bulk order options',
    itemListName: 'Bulk Handmade Gifts',
    seoArticle: [
      {
        heading: 'Why Order in Bulk?',
        level: 'h2',
        paragraphs: [
          'Ordering our handmade crochet items in bulk gives you access to wholesale pricing while providing your guests or employees with a high-quality, memorable, and unique gift.'
        ]
      }
    ],
    relatedSlugs: ['corporate-gifts', 'wholesale-crochet-gifts', 'custom-crochet-bulk-orders'],
  },
  {
    slug: 'corporate-gifts',
    title: 'Handmade Corporate Gifts | Unique Employee Gifting',
    description: 'Shop handmade corporate gifts. Elevate your employee appreciation and client gifting with unique, bespoke crochet items.',
    ogDescription: 'Shop handmade corporate gifts. Elevate your employee appreciation and client gifting with unique crochet items.',
    hero: {
      badge: '🏢 Corporate Gifting',
      heading: 'Handmade Corporate Gifts',
      subheading: 'Stand out from the standard corporate swag with memorable, handcrafted gifts.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Corporate Gifts',
    gridLabel: 'Corporate gift ideas',
    itemListName: 'Corporate Gifts',
    seoArticle: [
      {
        heading: 'A Gift They Will Actually Keep',
        level: 'h2',
        paragraphs: [
          'Most corporate swag ends up in a drawer. A beautiful handmade crochet plant or custom amigurumi desk buddy is a gift that employees will proudly display on their desks.'
        ]
      }
    ],
    relatedSlugs: ['employee-appreciation-gifts', 'client-gifts', 'bulk-orders'],
  },
  {
    slug: 'crochet-corporate-gifts',
    title: 'Crochet Corporate Gifts | Customized Business Swag',
    description: 'Discover crochet corporate gifts. Handcrafted, customized business gifts and swag for modern companies.',
    ogDescription: 'Discover crochet corporate gifts. Handcrafted, customized business gifts and swag.',
    hero: {
      badge: '🧶 Artisan Swag',
      heading: 'Crochet Corporate Gifts',
      subheading: 'Replace boring company swag with beautiful, handmade crochet desk accessories.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Crochet Corporate',
    gridLabel: 'Shop corporate crochet',
    itemListName: 'Crochet Corporate Gifts',
    seoArticle: [
      {
        heading: 'Customizable and Unique',
        level: 'h2',
        paragraphs: [
          'We can customize our crochet gifts to match your brand colors, creating a unique and cohesive corporate gifting experience for your team.'
        ]
      }
    ],
    relatedSlugs: ['corporate-gifts', 'custom-logo-gifts', 'bulk-orders'],
  },
  {
    slug: 'wedding-return-gifts',
    title: 'Wedding Return Gifts | Handmade Favors for Guests',
    description: 'Shop wedding return gifts. Give your guests a beautiful, lasting memory with our handmade crochet wedding favors.',
    ogDescription: 'Shop wedding return gifts. Give your guests a beautiful, lasting memory with our handmade crochet wedding favors.',
    hero: {
      badge: '💍 Wedding Favors',
      heading: 'Wedding Return Gifts',
      subheading: 'Thank your guests with a beautiful, handcrafted keepsake they will cherish.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Wedding Favors',
    gridLabel: 'Wedding return gifts',
    itemListName: 'Wedding Return Gifts',
    seoArticle: [
      {
        heading: 'A Lasting Impression',
        level: 'h2',
        paragraphs: [
          'Handmade crochet items like mini roses or personalized keychains make perfect wedding return gifts. Unlike edible favors, these are permanent keepsakes that remind your guests of your special day.'
        ]
      }
    ],
    relatedSlugs: ['crochet-wedding-favors', 'custom-crochet-wedding-gifts', 'bulk-orders'],
  },
  {
    slug: 'crochet-wedding-favors',
    title: 'Crochet Wedding Favors | Unique Handmade Keepsakes',
    description: 'Order crochet wedding favors. Unique, handcrafted keepsakes for your guests, perfectly matched to your wedding theme.',
    ogDescription: 'Order crochet wedding favors. Unique, handcrafted keepsakes for your guests.',
    hero: {
      badge: '💐 For The Guests',
      heading: 'Crochet Wedding Favors',
      subheading: 'Bespoke handmade favors that match your wedding aesthetic perfectly.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Crochet Favors',
    gridLabel: 'Shop wedding favors',
    itemListName: 'Crochet Wedding Favors',
    seoArticle: [
      {
        heading: 'Matches Any Theme',
        level: 'h2',
        paragraphs: [
          'Because all our items are handmade to order, we can adjust the yarn colors to perfectly match your wedding palette, ensuring a cohesive look for your reception tables.'
        ]
      }
    ],
    relatedSlugs: ['wedding-return-gifts', 'bridal-shower-favors', 'custom-crochet-bulk-orders'],
  },
  {
    slug: 'crochet-party-favors',
    title: 'Crochet Party Favors | Handmade Event Gifts',
    description: 'Find crochet party favors for any event. Unique, handmade gifts perfect for birthdays, anniversaries, and celebrations.',
    ogDescription: 'Find crochet party favors for any event. Unique, handmade gifts perfect for celebrations.',
    hero: {
      badge: '🎉 Party Favors',
      heading: 'Crochet Party Favors',
      subheading: 'Make your party unforgettable with unique, handcrafted favors for your guests.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Party Favors',
    gridLabel: 'Shop party favors',
    itemListName: 'Crochet Party Favors',
    seoArticle: [
      {
        heading: 'Versatile and Fun',
        level: 'h2',
        paragraphs: [
          'From cute amigurumi keychains for a child\'s birthday to elegant mini bouquets for an anniversary dinner, our crochet party favors can be tailored to any type of event.'
        ]
      }
    ],
    relatedSlugs: ['baby-shower-favors', 'bulk-crochet-keychains', 'bulk-orders'],
  },
  {
    slug: 'baby-shower-favors',
    title: 'Baby Shower Favors | Handmade Crochet Baby Gifts',
    description: 'Shop baby shower favors. Adorable, safe, and handmade crochet keepsakes for your baby shower guests.',
    ogDescription: 'Shop baby shower favors. Adorable, safe, and handmade crochet keepsakes for your guests.',
    hero: {
      badge: '🍼 Baby Shower',
      heading: 'Baby Shower Favors',
      subheading: 'Thank your loved ones with adorable, handmade crochet keepsakes.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Baby Shower Favors',
    gridLabel: 'Shop baby shower favors',
    itemListName: 'Baby Shower Favors',
    seoArticle: [
      {
        heading: 'Sweet and Thoughtful',
        level: 'h2',
        paragraphs: [
          'Handmade crochet items fit perfectly with the sweet, gentle theme of a baby shower. Mini crochet animals or baby-themed keychains make incredibly thoughtful favors.'
        ]
      }
    ],
    relatedSlugs: ['crochet-party-favors', 'custom-crochet-baby-gifts', 'bulk-orders'],
  },
  {
    slug: 'bridal-shower-favors',
    title: 'Bridal Shower Favors | Elegant Handmade Keepsakes',
    description: 'Order bridal shower favors. Elegant, bespoke crochet flowers and keychains to thank your bridal shower guests.',
    ogDescription: 'Order bridal shower favors. Elegant, bespoke crochet flowers and keychains.',
    hero: {
      badge: '👰 Bridal Shower',
      heading: 'Bridal Shower Favors',
      subheading: 'Elegant handmade keepsakes to celebrate the bride-to-be with her closest friends.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'flower-bouquets'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bridal Favors',
    gridLabel: 'Shop bridal favors',
    itemListName: 'Bridal Shower Favors',
    seoArticle: [
      {
        heading: 'Elegant Celebrations',
        level: 'h2',
        paragraphs: [
          'Our mini crochet flower bouquets or delicate keychains are the perfect elegant touch for a bridal shower, offering a beautiful memento for the bride\'s friends and family.'
        ]
      }
    ],
    relatedSlugs: ['wedding-return-gifts', 'crochet-wedding-favors', 'crochet-party-favors'],
  },
  {
    slug: 'crochet-event-gifts',
    title: 'Crochet Event Gifts | Customized Handmade Event Swag',
    description: 'Discover crochet event gifts. Customized, handmade swag and favors for large events, conferences, and retreats.',
    ogDescription: 'Discover crochet event gifts. Customized, handmade swag and favors for events.',
    hero: {
      badge: '🎪 Event Gifting',
      heading: 'Crochet Event Gifts',
      subheading: 'Provide your event attendees with a unique, high-quality handmade gift.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Event Gifts',
    gridLabel: 'Shop event gifts',
    itemListName: 'Crochet Event Gifts',
    seoArticle: [
      {
        heading: 'Stand Out at Conferences',
        level: 'h2',
        paragraphs: [
          'If you want your event or conference to be remembered, skip the cheap plastic pens. A handcrafted crochet item acts as a premium touchpoint that attendees will love.'
        ]
      }
    ],
    relatedSlugs: ['corporate-gifts', 'bulk-orders', 'custom-logo-gifts'],
  },
  {
    slug: 'employee-appreciation-gifts',
    title: 'Employee Appreciation Gifts | Handmade Desk Accessories',
    description: 'Shop employee appreciation gifts. Boost morale with unique, handmade crochet desk plants and amigurumi companions.',
    ogDescription: 'Shop employee appreciation gifts. Boost morale with unique, handmade crochet desk plants.',
    hero: {
      badge: '💼 Employee Rewards',
      heading: 'Employee Appreciation Gifts',
      subheading: 'Show your team you care with a thoughtful, handmade gift for their workspace.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Employee Gifts',
    gridLabel: 'Employee appreciation ideas',
    itemListName: 'Employee Appreciation Gifts',
    seoArticle: [
      {
        heading: 'Brightening the Workspace',
        level: 'h2',
        paragraphs: [
          'Crochet desk plants are the ultimate employee appreciation gift. They require no water, no sunlight, and bring an instant burst of joy and color to any office or remote workspace.'
        ]
      }
    ],
    relatedSlugs: ['corporate-gifts', 'client-gifts', 'crochet-corporate-gifts'],
  },
  {
    slug: 'client-gifts',
    title: 'Client Appreciation Gifts | Premium Handmade Business Gifts',
    description: 'Find the perfect client appreciation gifts. Premium, bespoke handmade crochet items that leave a lasting impression on your VIP clients.',
    ogDescription: 'Find the perfect client appreciation gifts. Premium, bespoke handmade crochet items.',
    hero: {
      badge: '🤝 VIP Clients',
      heading: 'Client Appreciation Gifts',
      subheading: 'Strengthen business relationships with premium, artisanal handmade gifts.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Client Gifts',
    gridLabel: 'Client gift options',
    itemListName: 'Client Appreciation Gifts',
    seoArticle: [
      {
        heading: 'Gifting with Intention',
        level: 'h2',
        paragraphs: [
          'When thanking your most valuable clients, generic gifts fall flat. A bespoke, handmade crochet arrangement demonstrates care, intention, and a high level of quality.'
        ]
      }
    ],
    relatedSlugs: ['corporate-gifts', 'employee-appreciation-gifts', 'custom-crochet'],
  },
  {
    slug: 'custom-logo-gifts',
    title: 'Custom Logo Gifts | Branded Handmade Crochet',
    description: 'Order custom logo gifts. Branded handmade crochet items featuring your company colors and logo tags for premium corporate gifting.',
    ogDescription: 'Order custom logo gifts. Branded handmade crochet items featuring your company colors.',
    hero: {
      badge: '🏷️ Branded Swag',
      heading: 'Custom Logo Crochet Gifts',
      subheading: 'Handmade artisanal gifts, branded specifically for your company.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Logo Gifts',
    gridLabel: 'Branded gift options',
    itemListName: 'Custom Logo Gifts',
    seoArticle: [
      {
        heading: 'Tasteful Branding',
        level: 'h2',
        paragraphs: [
          'We seamlessly integrate your brand into our handmade products. By matching your brand colors and adding elegant custom tags with your logo, we create premium branded swag that people actually want.'
        ]
      }
    ],
    relatedSlugs: ['corporate-gifts', 'crochet-corporate-gifts', 'bulk-orders'],
  },
  {
    slug: 'wholesale-crochet-gifts',
    title: 'Wholesale Crochet Gifts | Bulk Handmade Products',
    description: 'Shop wholesale crochet gifts. Access bulk pricing on our handmade amigurumi, bouquets, and accessories for your retail store or event.',
    ogDescription: 'Shop wholesale crochet gifts. Access bulk pricing on our handmade amigurumi, bouquets, and accessories.',
    hero: {
      badge: '📦 Wholesale',
      heading: 'Wholesale Crochet Gifts',
      subheading: 'Stock your shelves or plan your event with our premium wholesale crochet items.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Wholesale Gifts',
    gridLabel: 'Shop wholesale',
    itemListName: 'Wholesale Crochet Gifts',
    seoArticle: [
      {
        heading: 'Partner With Us',
        level: 'h2',
        paragraphs: [
          'Are you a boutique owner looking to stock unique handmade items? We offer competitive wholesale pricing for retailers who want to carry our high-quality crochet products.'
        ]
      }
    ],
    relatedSlugs: ['bulk-orders', 'bulk-crochet-gifts-price', 'bulk-crochet-keychains'],
  },
  {
    slug: 'bulk-crochet-keychains',
    title: 'Bulk Crochet Keychains | Wholesale Custom Keychains',
    description: 'Order bulk crochet keychains. Affordable, handmade custom keychains perfect for events, schools, and corporate giveaways.',
    ogDescription: 'Order bulk crochet keychains. Affordable, handmade custom keychains perfect for events.',
    hero: {
      badge: '🔑 Bulk Accessories',
      heading: 'Bulk Crochet Keychains',
      subheading: 'The perfect small, handmade gift for large groups and events.',
    },
    productFilter: { type: 'category', slugs: ['keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bulk Keychains',
    gridLabel: 'Shop keychains in bulk',
    itemListName: 'Bulk Crochet Keychains',
    seoArticle: [
      {
        heading: 'The Perfect Small Favor',
        level: 'h2',
        paragraphs: [
          'Keychains are our most popular item for bulk orders because they are affordable, universally loved, and highly customizable. They make excellent favors for schools, clubs, and parties.'
        ]
      }
    ],
    relatedSlugs: ['bulk-orders', 'wholesale-crochet-gifts', 'crochet-party-favors'],
  },
  {
    slug: 'bulk-crochet-gifts-price',
    title: 'Bulk Crochet Gifts Price | Wholesale Pricing Details',
    description: 'View our bulk crochet gifts price list. Learn about wholesale discounts and pricing tiers for large handmade crochet orders.',
    ogDescription: 'View our bulk crochet gifts price list. Learn about wholesale discounts and pricing tiers.',
    hero: {
      badge: '💰 Pricing Info',
      heading: 'Bulk Orders Pricing',
      subheading: 'Transparent wholesale pricing and discount tiers for your large orders.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Bulk Pricing',
    gridLabel: 'Pricing examples',
    itemListName: 'Bulk Order Pricing',
    seoArticle: [
      {
        heading: 'Transparent Tiered Pricing',
        level: 'h2',
        paragraphs: [
          'We offer tiered wholesale pricing based on order volume. Because every item is meticulously handmade, our pricing reflects the fair wage of our artisans while providing you with an excellent discount for large quantities.'
        ]
      }
    ],
    relatedSlugs: ['bulk-orders', 'wholesale-crochet-gifts', 'custom-order-process'],
  },

  // ═══════════════════════════════════════════
  // MISCELLANEOUS & ACCESSORIES
  // ═══════════════════════════════════════════
  {
    slug: 'crochet-keychains',
    title: 'Crochet Keychains | Handmade Bag Charms',
    description: 'Shop adorable crochet keychains online. Handcrafted amigurumi keychains, bag charms, and cute accessories perfect for gifting.',
    ogDescription: 'Shop adorable crochet keychains online. Handcrafted amigurumi keychains, bag charms, and cute accessories.',
    hero: {
      badge: '🔑 Key Accessories',
      heading: 'Crochet Keychains',
      subheading: 'Small, cute, and handmade. The perfect little accessory for your keys or bag.',
    },
    productFilter: { type: 'category', slugs: ['keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Keychains',
    gridLabel: 'Shop keychains',
    itemListName: 'Crochet Keychains Collection',
    seoArticle: [
      {
        heading: 'A Tiny Piece of Art',
        level: 'h2',
        paragraphs: [
          'A crochet keychain is more than just an accessory; it is a tiny, durable piece of handmade art that goes wherever you go.'
        ]
      }
    ],
    relatedSlugs: ['crochet-keychains-for-gifts', 'crochet-keychain-for-girlfriend', 'bulk-crochet-keychains'],
  },
  {
    slug: 'crochet-keychains-for-gifts',
    title: 'Crochet Keychain Gifts | Cute Handmade Accessories',
    description: 'Find perfect crochet keychain gifts. Small, thoughtful handmade accessories perfect for birthdays, return gifts, and surprises.',
    ogDescription: 'Find perfect crochet keychain gifts. Small, thoughtful handmade accessories.',
    hero: {
      badge: '🎁 Small Surprises',
      heading: 'Crochet Keychain Gifts',
      subheading: 'A thoughtful, handcrafted gift that fits right in your pocket.',
    },
    productFilter: { type: 'category', slugs: ['keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Keychain Gifts',
    gridLabel: 'Shop keychain gifts',
    itemListName: 'Crochet Keychain Gifts',
    seoArticle: [
      {
        heading: 'Small But Thoughtful',
        level: 'h2',
        paragraphs: [
          'You don\'t need a big budget to give a meaningful gift. A beautifully crafted amigurumi keychain shows you care without breaking the bank.'
        ]
      }
    ],
    relatedSlugs: ['crochet-keychain-for-friends', 'small-crochet-gifts', 'cute-crochet-gifts'],
  },
  {
    slug: 'crochet-keychain-for-girlfriend',
    title: 'Crochet Keychain for Girlfriend | Cute Romantic Charms',
    description: 'Buy a cute crochet keychain for your girlfriend. Handmade matching keychains, cute amigurumi animals, and romantic gifts.',
    ogDescription: 'Buy a cute crochet keychain for your girlfriend. Handmade matching keychains and cute amigurumi animals.',
    hero: {
      badge: '❤️ For Her',
      heading: 'Crochet Keychains For Girlfriend',
      subheading: 'Give her a cute little companion she can carry everywhere.',
    },
    productFilter: { type: 'category', slugs: ['keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Girlfriend',
    gridLabel: 'Shop for girlfriend',
    itemListName: 'Girlfriend Crochet Keychains',
    seoArticle: [
      {
        heading: 'A Daily Reminder of You',
        level: 'h2',
        paragraphs: [
          'Gift her a cute crochet strawberry or tiny teddy bear keychain so she has a handmade reminder of your love every time she grabs her keys.'
        ]
      }
    ],
    relatedSlugs: ['crochet-keychain-for-boyfriend', 'crochet-keychains-for-gifts', 'cute-crochet-gifts'],
  },
  {
    slug: 'crochet-keychain-for-boyfriend',
    title: 'Crochet Keychain for Boyfriend | Handmade Key Accessories',
    description: 'Shop a crochet keychain for your boyfriend. Cool, unique handmade keychains and amigurumi characters he will love.',
    ogDescription: 'Shop a crochet keychain for your boyfriend. Cool, unique handmade keychains and amigurumi characters.',
    hero: {
      badge: '🎮 For Him',
      heading: 'Crochet Keychains For Boyfriend',
      subheading: 'A cool, handmade accessory for his car keys or backpack.',
    },
    productFilter: { type: 'category', slugs: ['keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Boyfriend',
    gridLabel: 'Shop for boyfriend',
    itemListName: 'Boyfriend Crochet Keychains',
    seoArticle: [
      {
        heading: 'Subtle and Special',
        level: 'h2',
        paragraphs: [
          'Boys love keychains too! Choose a crochet version of his favorite video game character or a sleek, custom-color design that suits his style.'
        ]
      }
    ],
    relatedSlugs: ['crochet-keychain-for-girlfriend', 'crochet-keychain-for-friends', 'crochet-keychains'],
  },
  {
    slug: 'crochet-keychain-for-friends',
    title: 'Crochet Keychain for Friends | Matching Friendship Gifts',
    description: 'Get a crochet keychain for friends. Cute matching amigurumi keychains perfect for best friends and friendship day gifts.',
    ogDescription: 'Get a crochet keychain for friends. Cute matching amigurumi keychains perfect for best friends.',
    hero: {
      badge: '👯 Besties',
      heading: 'Crochet Keychains For Friends',
      subheading: 'Get matching handcrafted keychains for you and your best friend.',
    },
    productFilter: { type: 'category', slugs: ['keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'For Friends',
    gridLabel: 'Shop friend keychains',
    itemListName: 'Friendship Crochet Keychains',
    seoArticle: [
      {
        heading: 'The Modern Friendship Bracelet',
        level: 'h2',
        paragraphs: [
          'Matching crochet keychains are the new friendship bracelets. They are incredibly cute, durable, and make for a perfect small gift to show your appreciation.'
        ]
      }
    ],
    relatedSlugs: ['crochet-keychains-for-gifts', 'small-crochet-gifts', 'cute-crochet-gifts'],
  },
  {
    slug: 'crochet-hair-accessories',
    title: 'Crochet Hair Accessories | Handmade Clips & Bows',
    description: 'Shop beautiful crochet hair accessories. Handmade flower clips, bows, and unique hair pieces crafted from soft yarn.',
    ogDescription: 'Shop beautiful crochet hair accessories. Handmade flower clips, bows, and unique hair pieces.',
    hero: {
      badge: '🎀 Hair Styling',
      heading: 'Crochet Hair Accessories',
      subheading: 'Add a touch of handmade elegance to your everyday look.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Hair Accessories',
    gridLabel: 'Shop hair accessories',
    itemListName: 'Crochet Hair Accessories',
    seoArticle: [
      {
        heading: 'Soft and Stylish',
        level: 'h2',
        paragraphs: [
          'Unlike plastic clips that can break or pull your hair, crochet hair accessories are incredibly gentle, durable, and visually stunning.'
        ]
      }
    ],
    relatedSlugs: ['crochet-hair-clips', 'crochet-bows', 'crochet-flower-hair-clips'],
  },
  {
    slug: 'crochet-hair-clips',
    title: 'Crochet Hair Clips | Handmade Floral Hair Pins',
    description: 'Find gorgeous crochet hair clips. Handmade floral and amigurumi hair pins that add a unique touch to any outfit.',
    ogDescription: 'Find gorgeous crochet hair clips. Handmade floral and amigurumi hair pins.',
    hero: {
      badge: '🌸 Hair Clips',
      heading: 'Handmade Crochet Hair Clips',
      subheading: 'Beautiful, durable, and uniquely handmade clips for all hair types.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Hair Clips',
    gridLabel: 'Shop hair clips',
    itemListName: 'Crochet Hair Clips',
    seoArticle: [
      {
        heading: 'Stand Out From The Crowd',
        level: 'h2',
        paragraphs: [
          'A delicate crochet flower securely fastened to a high-quality metal clip offers a cottagecore aesthetic that is highly sought after.'
        ]
      }
    ],
    relatedSlugs: ['crochet-hair-accessories', 'crochet-flower-hair-clips', 'crochet-bows'],
  },
  {
    slug: 'crochet-flower-hair-clips',
    title: 'Crochet Flower Hair Clips | Beautiful Handmade Pins',
    description: 'Buy crochet flower hair clips. Delicate, beautifully crafted handmade flower pins for toddlers, girls, and women.',
    ogDescription: 'Buy crochet flower hair clips. Delicate, beautifully crafted handmade flower pins.',
    hero: {
      badge: '🌺 Floral Hair',
      heading: 'Crochet Flower Hair Clips',
      subheading: 'Wear a bouquet in your hair with our delicate handmade flower clips.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Flower Clips',
    gridLabel: 'Shop flower clips',
    itemListName: 'Crochet Flower Hair Clips',
    seoArticle: [
      {
        heading: 'A Forever Blossom',
        level: 'h2',
        paragraphs: [
          'Real flower clips wilt in hours. Our crochet flower hair clips stay vibrant and perfect forever, making them ideal for weddings, festivals, and daily wear.'
        ]
      }
    ],
    relatedSlugs: ['crochet-hair-clips', 'crochet-hair-accessories', 'crochet-bows'],
  },
  {
    slug: 'crochet-bows',
    title: 'Crochet Bows | Handmade Hair Bows & Accessories',
    description: 'Shop crochet bows. Beautifully textured, handmade yarn bows for hair clips, headbands, and baby accessories.',
    ogDescription: 'Shop crochet bows. Beautifully textured, handmade yarn bows for hair clips and headbands.',
    hero: {
      badge: '🎀 Classic Bows',
      heading: 'Handmade Crochet Bows',
      subheading: 'Add a sweet, vintage touch to any hairstyle with a handmade crochet bow.',
    },
    productFilter: { type: 'category', slugs: ['hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Crochet Bows',
    gridLabel: 'Shop crochet bows',
    itemListName: 'Crochet Bows',
    seoArticle: [
      {
        heading: 'Timeless Elegance',
        level: 'h2',
        paragraphs: [
          'The crochet bow is a timeless accessory. The thick texture of the yarn provides a luxurious, structured look that fabric bows simply cannot match.'
        ]
      }
    ],
    relatedSlugs: ['crochet-hair-clips', 'crochet-hair-accessories', 'crochet-flower-hair-clips'],
  },
  {
    slug: 'handmade-crochet-gifts',
    title: 'Handmade Crochet Gifts | Premium Artisanal Gifting',
    description: 'Discover premium handmade crochet gifts. Artisanal crochet flowers, amigurumi toys, and custom gifts made with love.',
    ogDescription: 'Discover premium handmade crochet gifts. Artisanal crochet flowers, amigurumi toys, and custom gifts.',
    hero: {
      badge: '✨ Artisanal',
      heading: 'Handmade Crochet Gifts',
      subheading: 'Give a gift with a soul. Explore our collection of 100% handmade crochet items.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Handmade Gifts',
    gridLabel: 'Shop handmade gifts',
    itemListName: 'Handmade Crochet Gifts',
    seoArticle: [
      {
        heading: 'The Value of Handmade',
        level: 'h2',
        paragraphs: [
          'In a world of mass production, a handmade gift stands out. It carries the time, skill, and care of the artisan who created it, making it incredibly special.'
        ]
      }
    ],
    relatedSlugs: ['handmade-gifts-india', 'cute-crochet-gifts', 'aesthetic-crochet-gifts'],
  },
  {
    slug: 'cute-crochet-gifts',
    title: 'Cute Crochet Gifts | Adorable Handmade Items',
    description: 'Find the most cute crochet gifts. Adorable handmade plushies, pastel keychains, and aesthetic room decor.',
    ogDescription: 'Find the most cute crochet gifts. Adorable handmade plushies, pastel keychains, and aesthetic room decor.',
    hero: {
      badge: '🥺 Too Cute',
      heading: 'Cute Crochet Gifts',
      subheading: 'Prepare for overwhelming cuteness. Shop our most adorable handmade items.',
    },
    productFilter: { type: 'category', slugs: ['toys', 'keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Cute Gifts',
    gridLabel: 'Shop cute gifts',
    itemListName: 'Cute Crochet Gifts',
    seoArticle: [
      {
        heading: 'Guaranteed to Make Them Smile',
        level: 'h2',
        paragraphs: [
          'If you want a gift that elicits an immediate "awww!", you are in the right place. Our cute crochet gifts feature adorable faces, pastel colors, and soft textures.'
        ]
      }
    ],
    relatedSlugs: ['aesthetic-crochet-gifts', 'small-crochet-gifts', 'crochet-keychains-for-gifts'],
  },
  {
    slug: 'aesthetic-crochet-gifts',
    title: 'Aesthetic Crochet Gifts | Trendy Handmade Decor',
    description: 'Shop aesthetic crochet gifts. Trendy, cottagecore, and minimalist handmade crochet flowers, bags, and accessories.',
    ogDescription: 'Shop aesthetic crochet gifts. Trendy, cottagecore, and minimalist handmade crochet flowers.',
    hero: {
      badge: '✨ Aesthetic',
      heading: 'Aesthetic Crochet Gifts',
      subheading: 'Trendy, beautiful, and highly Instagrammable handmade gifts.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Aesthetic Gifts',
    gridLabel: 'Shop aesthetic gifts',
    itemListName: 'Aesthetic Crochet Gifts',
    seoArticle: [
      {
        heading: 'Matches Your Vibe',
        level: 'h2',
        paragraphs: [
          'Crochet is back in a big way. From cottagecore flower bouquets to minimalist desk accessories, our aesthetic crochet gifts are perfectly on-trend.'
        ]
      }
    ],
    relatedSlugs: ['cute-crochet-gifts', 'handmade-crochet-gifts', 'small-crochet-gifts'],
  },
  {
    slug: 'small-crochet-gifts',
    title: 'Small Crochet Gifts | Mini Handmade Surprises',
    description: 'Find small crochet gifts under your budget. Tiny handmade amigurumi, keychains, and mini flower accessories.',
    ogDescription: 'Find small crochet gifts under your budget. Tiny handmade amigurumi and keychains.',
    hero: {
      badge: '🤏 Mini Joys',
      heading: 'Small Crochet Gifts',
      subheading: 'Great things come in small packages. Shop our collection of tiny handmade joys.',
    },
    productFilter: { type: 'category', slugs: ['keychains', 'hair-accessories'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Small Gifts',
    gridLabel: 'Shop small gifts',
    itemListName: 'Small Crochet Gifts',
    seoArticle: [
      {
        heading: 'Pocket-Sized Perfection',
        level: 'h2',
        paragraphs: [
          'Small crochet gifts are perfect for stocking stuffers, return gifts, or "just because" surprises. They are highly affordable but carry the same handmade quality as our larger pieces.'
        ]
      }
    ],
    relatedSlugs: ['mini-crochet-gifts', 'crochet-keychains-for-gifts', 'cute-crochet-gifts'],
  },
  {
    slug: 'mini-crochet-gifts',
    title: 'Mini Crochet Gifts | Tiny Handmade Masterpieces',
    description: 'Shop mini crochet gifts. Micro-amigurumi, tiny floral pins, and exquisitely detailed small handmade gifts.',
    ogDescription: 'Shop mini crochet gifts. Micro-amigurumi, tiny floral pins, and exquisitely detailed small handmade gifts.',
    hero: {
      badge: '🔍 Micro Art',
      heading: 'Mini Crochet Gifts',
      subheading: 'Exquisite detail on a tiny scale. Discover our mini handmade crochet items.',
    },
    productFilter: { type: 'category', slugs: ['keychains'] },
    orderBy: 'price_asc',
    breadcrumbLabel: 'Mini Gifts',
    gridLabel: 'Shop mini gifts',
    itemListName: 'Mini Crochet Gifts',
    seoArticle: [
      {
        heading: 'Incredible Detail',
        level: 'h2',
        paragraphs: [
          'Crocheting on a miniature scale requires immense skill. Our mini crochet gifts are true masterpieces of patience and precision, making them highly unique gifts.'
        ]
      }
    ],
    relatedSlugs: ['small-crochet-gifts', 'crochet-keychains-for-gifts', 'aesthetic-crochet-gifts'],
  },
  {
    slug: 'handmade-gifts-india',
    title: 'Handmade Gifts India | Premium Artisanal Crochet',
    description: 'Buy premium handmade gifts in India. We ship bespoke, artisanal crochet flowers, toys, and custom gifts nationwide.',
    ogDescription: 'Buy premium handmade gifts in India. We ship bespoke, artisanal crochet flowers, toys, and custom gifts nationwide.',
    hero: {
      badge: '🇮🇳 Made in India',
      heading: 'Handmade Gifts in India',
      subheading: 'Premium, artisanal crochet crafted by skilled Indian women and shipped nationwide.',
    },
    productFilter: { type: 'all' },
    orderBy: 'price_desc',
    breadcrumbLabel: 'Handmade India',
    gridLabel: 'Shop Indian handmade',
    itemListName: 'Handmade Gifts India',
    seoArticle: [
      {
        heading: 'Empowering Local Artisans',
        level: 'h2',
        paragraphs: [
          'When you buy handmade gifts from us, you are directly supporting skilled women artisans across India, keeping the beautiful tradition of fiber arts alive.'
        ]
      }
    ],
    relatedSlugs: ['handmade-crochet-gifts', 'aesthetic-crochet-gifts', 'corporate-gifts'],
  }
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Look up an SEO page config by slug */
export function getSeoPageBySlug(slug: string): GiftPageConfig | undefined {
  return SEO_PAGES.find((p) => p.slug === slug);
}

/** Get all valid SEO page slugs (for generateStaticParams) */
export function getAllSeoSlugs(): string[] {
  return SEO_PAGES.map((p) => p.slug);
}
