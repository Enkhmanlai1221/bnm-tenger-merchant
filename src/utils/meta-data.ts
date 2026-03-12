interface MetaData {
  title: string;
  description: string;
  keywords: string[];
  author?: string;
  ogImage?: string;
  locale?: string;
  type?: string;
  siteName?: string;
  url?: string;
}

export const defaultMetaData: MetaData = {
  title: "Tenger BNM",
  description:
    "Book authentic Mongolian gers (yurts) for your next adventure. Experience nomadic living with modern comfort. Find and reserve traditional yurts across various locations.",
  keywords: [
    "ger rental",
    "yurt booking",
    "mongolian yurt",
    "traditional ger",
    "nomadic accommodation",
    "glamping",
    "unique stays",
    "eco-friendly accommodation",
    "mongolian experience",
    "cultural stay",
  ],
  author: "Ger Book",
  siteName: "Ger Book",
  type: "website",
  locale: "en",
  ogImage: "/ger-screen.png",
  url: "https://gerbook.com",
};

/**
 * Combines default metadata with page-specific metadata
 * @param pageMetaData - Page-specific metadata to merge with defaults
 * @returns Combined metadata object
 */
export function getMetaData(pageMetaData?: Partial<MetaData>): MetaData {
  return {
    ...defaultMetaData,
    ...pageMetaData,
  };
}

/**
 * Generates Open Graph metadata for social sharing
 * @param metaData - Metadata to generate OG tags from
 * @returns Object containing OG metadata
 */
export function generateOGMetadata(metaData: MetaData) {
  return {
    "og:title": metaData.title,
    "og:description": metaData.description,
    "og:image": metaData.ogImage,
    "og:type": metaData.type,
    "og:site_name": metaData.siteName,
    "og:locale": metaData.locale,
    "og:url": metaData.url,
  };
}

/**
 * Generates metadata for specific yurt listing pages
 * @param yurtData - Data about the specific yurt
 * @returns MetaData object for the yurt listing
 */
export function getYurtMetaData(yurtData: {
  name: string;
  location: string;
  price: number;
  description: string;
  image: string;
}): MetaData {
  return {
    ...defaultMetaData,
    title: `${yurtData.name} | ${yurtData.location} | Ger Book`,
    description: `Stay in ${yurtData.name}, a traditional Mongolian ger in ${yurtData.location}. ${yurtData.description.slice(0, 100)}...`,
    ogImage: yurtData.image,
    keywords: [
      ...defaultMetaData.keywords,
      yurtData.location.toLowerCase(),
      "ger rental " + yurtData.location.toLowerCase(),
      "yurt stay " + yurtData.location.toLowerCase(),
    ],
    type: "product",
  };
}
