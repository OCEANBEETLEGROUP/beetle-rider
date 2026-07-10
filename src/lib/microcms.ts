import { createClient } from 'microcms-js-sdk';
import type { MicroCMSImage, MicroCMSListContent, MicroCMSObjectContent } from 'microcms-js-sdk';

// microCMS client
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// ---------- Types ----------

export type Vehicle = {
  slug: string;
  name: string;
  base: string;
  engine?: string;
  transmission?: string;
  fuelTank?: string;
  tires?: string;
  weight?: string;
  style?: string;
  builder?: string;
  painter?: string;
  thumbnail: MicroCMSImage;
  gallery?: MicroCMSImage[];
  dayRidePrice: number;
  multiDayPrice: number;
  bokunDayRideId?: string;
  bokunMultiDayId?: string;
  status?: string[];
  order: number;
  /** microCMS公開終了日時（公開終了アイテムはAPIキーによっては返るため必ず除外に使う） */
  closedAt?: string;
} & MicroCMSListContent;

export type Destination = {
  slug: string;
  name: string;
  nameJp: string;
  description?: string;
  descriptionJp?: string;
  timeFromBase?: string;
  image: MicroCMSImage;
  category: 'chopper' | 'ebike' | 'both';
} & MicroCMSListContent;

export type InstagramPost = {
  image: MicroCMSImage;
  account: 'chopper' | 'ebike';
  altText?: string;
  order: number;
} & MicroCMSListContent;

export type SiteConfig = {
  businessHours?: string;
  address?: string;
  mapUrl?: string;
  phone?: string;
  instagramChopper?: string;
  instagramEbike?: string;
  announcement?: string;
  email?: string;
  privacyPolicyUrl?: string;
  tokushohoUrl?: string;
  importantNoticesUrl?: string;
} & MicroCMSObjectContent;

// ---------- Data Fetchers ----------

/** All vehicles sorted by order */
export async function getVehicles() {
  return await client.getList<Vehicle>({
    endpoint: 'vehicles',
    queries: { orders: 'order', limit: 10 },
  });
}

/** Destinations, optionally filtered by category */
export async function getDestinations(category?: 'chopper' | 'ebike' | 'both') {
  // Note: microCMS select field values have trailing space
  const filters = category ? `category[contains]${category} ` : undefined;
  return await client.getList<Destination>({
    endpoint: 'destinations',
    queries: { filters, orders: 'createdAt', limit: 50 },
  });
}

/** Instagram gallery posts */
export async function getInstagramPosts(account?: 'chopper' | 'ebike') {
  const filters = account ? `account[contains]${account}` : undefined;
  return await client.getList<InstagramPost>({
    endpoint: 'instagram',
    queries: { filters, orders: 'order', limit: 50 },
  });
}

/** Site config (object type) */
export async function getSiteConfig() {
  return await client.getObject<SiteConfig>({
    endpoint: 'site-config',
  });
}
