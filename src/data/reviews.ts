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
  /** 日本語ページ用の訳文。あえて「Google翻訳っぽい」直訳調にする（実レビュー感の維持・TAKE指示 2026-07-10） */
  textJa: string;
  source: 'Google';
  product: 'ebike' | 'chopper';
};

export const REVIEWS: Review[] = [
  {
    author: 'Imperial',
    rating: 5,
    product: 'ebike',
    text: 'Highly recommend for exploring Kamakura! The owner is very nice and helpful. We used the E-bikes and they were a blast to use along the coast of Kamakura to visit all the landmarks. Definitely rent it for the whole day to take your time riding and exploring.',
    textJa: '鎌倉を探索するのに強くおすすめします！オーナーはとても親切で、助けになってくれます。私たちはE-bikeを利用しましたが、鎌倉の海岸沿いを走ってすべてのランドマークを訪れるのは最高に楽しかったです。時間をかけてライドと探索を楽しむために、ぜひ1日レンタルしてください。',
    source: 'Google',
  },
  {
    author: 'Robert P.',
    rating: 5,
    product: 'ebike',
    text: 'I was in Japan for two weeks and this was the best experience I did hands down. The e-bikes are super easy to use and is the best way to see the city and surrounding area. Jose was the best, great customer service and super friendly! I could not recommend an experience more.',
    textJa: '日本に2週間滞在しましたが、間違いなくこれが一番の体験でした。E-bikeはとても簡単に使えて、街と周辺エリアを見るのに最高の方法です。Joseは最高で、素晴らしいカスタマーサービスで、とてもフレンドリーでした！これ以上おすすめできる体験はありません。',
    source: 'Google',
  },
  {
    author: 'Sofia P.',
    rating: 5,
    product: 'ebike',
    text: "We used the E-bikes — such a great option if you're only coming for the day! They really helped us save time since we wanted to visit several places. Plus, they were super comfortable, easy to use, and had the perfect speed for sightseeing. Highly recommend!",
    textJa: '私たちはE-bikeを利用しました — 日帰りで来る場合には、とても良い選択肢です！いくつかの場所を訪れたかったので、時間の節約に本当に役立ちました。さらに、とても快適で、使いやすく、観光にちょうど良いスピードでした。強くおすすめします！',
    source: 'Google',
  },
  {
    author: 'Tyler P.',
    rating: 5,
    product: 'chopper',
    text: 'Rented 4 of the choppers for 8 hours. Absolutely amazing experience. Took them all through Hakone turnpike. Definitely give these guys a look. Good English too so very foreigner friendly.',
    textJa: 'チョッパーを4台、8時間レンタルしました。本当に素晴らしい体験でした。全員で箱根ターンパイクまで走りました。ぜひこのお店をチェックしてみてください。英語も上手なので、外国人にもとてもフレンドリーです。',
    source: 'Google',
  },
  {
    author: 'Peter G.',
    rating: 5,
    product: 'chopper',
    text: "If you're an avid motorcycle rider and enjoy spending time by the beach with a breathtaking view of Mt. Fuji, Beetle Rider is the perfect place to rent some cool Harley-Davidson chopper motorcycles.",
    textJa: 'あなたが熱心なバイクライダーで、富士山の息をのむような眺めとともにビーチで時間を過ごすのが好きなら、Beetle Riderはクールなハーレーダビッドソンのチョッパーバイクをレンタルするのに完璧な場所です。',
    source: 'Google',
  },
  {
    author: 'Pedro M.',
    rating: 5,
    product: 'chopper',
    text: 'Absolutely stunning experience with those guys. They really rocked with this project of renting a chopper in Japan. Awesome vibes around Kamakura coast.',
    textJa: '彼らとの体験は本当に素晴らしいものでした。日本でチョッパーをレンタルするというこのプロジェクトを、彼らは本当にやり遂げています。鎌倉の海岸沿いは最高の雰囲気でした。',
    source: 'Google',
  },
];
