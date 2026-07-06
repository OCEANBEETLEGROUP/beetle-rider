/**
 * Google レビューデータ（手動キュレーション）
 * 出典: Google Maps「BEETLE RIDER | OCEANBEETLE KAMAKURA」2026-07-06 取得
 * 更新手順: Googleマップのレビューから転記 → rating/count を最新化
 * ※実在レビューのみ掲載すること（創作は絶対禁止）
 *
 * chopperレビュー3件はGoogle Maps実レビューより転記（2026-07-06取得: Tyler Porter/Peter Giang/
 * Pedro Henrique Lobão Mariano、いずれも★5・総合5.0×111件時点）。
 */

export const GOOGLE_RATING = 5.0;
export const GOOGLE_REVIEW_COUNT = 111;
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/BiByu9Q6iXXFKN9E9';
/** データが実レビューか（サンプル時は false にして schema 出力を止める） */
export const REVIEWS_ARE_REAL = true;

export type Review = {
  author: string;
  rating: number;
  text: string;
  source: 'Google';
  product: 'ebike' | 'chopper';
};

export const REVIEWS: Review[] = [
  {
    author: 'Imperial',
    rating: 5,
    product: 'ebike',
    text: 'Highly recommend for exploring Kamakura! The owner is very nice and helpful. We used the E-bikes and they were a blast to use along the coast of Kamakura to visit all the landmarks. Definitely rent it for the whole day to take your time riding and exploring.',
    source: 'Google',
  },
  {
    author: 'Robert P.',
    rating: 5,
    product: 'ebike',
    text: 'I was in Japan for two weeks and this was the best experience I did hands down. The e-bikes are super easy to use and is the best way to see the city and surrounding area. Jose was the best, great customer service and super friendly! I could not recommend an experience more.',
    source: 'Google',
  },
  {
    author: 'Sofia P.',
    rating: 5,
    product: 'ebike',
    text: "We used the E-bikes — such a great option if you're only coming for the day! They really helped us save time since we wanted to visit several places. Plus, they were super comfortable, easy to use, and had the perfect speed for sightseeing. Highly recommend!",
    source: 'Google',
  },
  {
    author: 'Tyler P.',
    rating: 5,
    product: 'chopper',
    text: 'Rented 4 of the choppers for 8 hours. Absolutely amazing experience. Took them all through Hakone turnpike. Definitely give these guys a look. Good English too so very foreigner friendly.',
    source: 'Google',
  },
  {
    author: 'Peter G.',
    rating: 5,
    product: 'chopper',
    text: "If you're an avid motorcycle rider and enjoy spending time by the beach with a breathtaking view of Mt. Fuji, Beetle Rider is the perfect place to rent some cool Harley-Davidson chopper motorcycles.",
    source: 'Google',
  },
  {
    author: 'Pedro M.',
    rating: 5,
    product: 'chopper',
    text: 'Absolutely stunning experience with those guys. They really rocked with this project of renting a chopper in Japan. Awesome vibes around Kamakura coast.',
    source: 'Google',
  },
];
