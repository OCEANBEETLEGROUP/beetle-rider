# microCMS セットアップガイド

BEETLE RIDER 予約サイト（Astro）のヘッドレスCMS。
車両データ・観光スポット・ギャラリー・サイト設定をブラウザから編集可能にする。

---

## 前提

- **プラン:** Hobby（無料）— API数上限5、メンバー3人まで
- **フレームワーク:** Astro 6 + Tailwind CSS 4
- **連携方法:** microCMS JavaScript SDK → Astroのビルド時にデータ取得（SSG）

---

## 1. アカウント作成

1. https://microcms.io にアクセス
2. 右上「新規登録」→ メールアドレスとパスワードで登録
3. サービス作成画面で以下を入力:
   - **サービス名:** `beetle-rider`
   - **サービスID:** `beetle-rider`（URLの一部になる。英数字・ハイフンのみ）
4. 「作成」をクリック

---

## 2. API作成（5つ）

ダッシュボード左メニュー「コンテンツ（API）」→「+追加」で順番に作成する。

### 2-1. vehicles（車両データ）

| 項目 | 設定値 |
|------|--------|
| API名 | vehicles |
| エンドポイント | vehicles |
| APIの型 | リスト形式 |

**フィールド一覧:**

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|-------------|--------|------|------|------|
| `slug` | スラッグ | テキストフィールド | Yes | URL用。例: `shortfork`, `saxeflames`, `hellfire`, `leopard`, `bruno`, `gladiator` |
| `name` | 車名 | テキストフィールド | Yes | 例: SHORT FORK, SAXE FLAMES, HELL FIRE, LEOPARD, BRUNO, GLADIATOR |
| `base` | ベース車両 | テキストフィールド | Yes | 例: '99 XLH883, '97 XLH883, '88 XLH883, '99 XLH1200, '91 XLH883, '99 XL1200 |
| `transmission` | トランスミッション | テキストフィールド | No | 例: 5-Speed |
| `fuelTank` | 燃料タンク | テキストフィールド | No | 例: 8L |
| `tires` | タイヤ | テキストフィールド | No | 例: F19/R16 |
| `weight` | 車重 | テキストフィールド | No | 例: 210kg |
| `style` | スタイル | テキストフィールド | No | Chopper または Bobber |
| `builder` | ビルダー | テキストフィールド | No | 例: @ryoske.14 |
| `painter` | ペインター | テキストフィールド | No | |
| `thumbnail` | サムネイル | 画像 | Yes | ギャラリー1枚目と同じ画像を設定 |
| `gallery` | ギャラリー | 複数画像（繰り返し） | No | 車両の写真を複数枚登録 |
| `dayRidePrice` | DAY RIDE料金 | 数値 | Yes | 単位は円。例: 22000 |
| `multiDayPrice` | MULTI-DAY料金 | 数値 | Yes | 単位は円。例: 55000 |
| `bokunDayRideId` | Bokun DAY RIDE ID | テキストフィールド | No | Bokunウィジェット用の商品ID（後で設定） |
| `bokunMultiDayId` | Bokun MULTI-DAY ID | テキストフィールド | No | Bokunウィジェット用の商品ID（後で設定） |
| `order` | 表示順 | 数値 | Yes | 小さい数字が先に表示される。1〜6 |

**フィールド作成手順（1つずつ）:**
1. 「フィールドを追加」をクリック
2. 「テキストフィールド」等の種類を選択
3. フィールドIDと表示名を入力
4. 必須の場合は「必須項目にする」にチェック
5. 「追加」をクリック
6. 全フィールド分繰り返す

> **画像の「複数画像」について:** gallery フィールドは「繰り返し」フィールドを使い、中に「画像」フィールドを1つ配置する。これで複数画像を順番付きで登録できる。

### 2-2. destinations（観光スポット）

| 項目 | 設定値 |
|------|--------|
| API名 | destinations |
| エンドポイント | destinations |
| APIの型 | リスト形式 |

**フィールド一覧:**

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|-------------|--------|------|------|------|
| `slug` | スラッグ | テキストフィールド | Yes | 例: enoshima, hakone, kamakura |
| `name` | 英語名 | テキストフィールド | Yes | 例: Enoshima, Hakone |
| `nameJp` | 日本語名 | テキストフィールド | Yes | 例: 江ノ島, 箱根 |
| `description` | 英語説明 | テキストエリア | No | |
| `descriptionJp` | 日本語説明 | テキストエリア | No | |
| `timeFromBase` | 所要時間 | テキストフィールド | No | 例: ~20min, ~40min |
| `image` | 画像 | 画像 | Yes | スポットの代表画像 |
| `category` | カテゴリ | セレクトフィールド | Yes | 選択肢: `chopper` / `ebike` / `both` |

**セレクトフィールドの選択肢設定:**
1. categoryフィールド追加時に「セレクトフィールド」を選択
2. 「選択肢を追加」で以下3つを登録:
   - `chopper`（表示名: Chopper）
   - `ebike`（表示名: E-Bike）
   - `both`（表示名: Both）

### 2-3. instagram（ギャラリー画像）

| 項目 | 設定値 |
|------|--------|
| API名 | instagram |
| エンドポイント | instagram |
| APIの型 | リスト形式 |

**フィールド一覧:**

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|-------------|--------|------|------|------|
| `image` | 画像 | 画像 | Yes | |
| `account` | アカウント | セレクトフィールド | Yes | 選択肢: `chopper` / `ebike` |
| `altText` | 代替テキスト | テキストフィールド | No | SEO・アクセシビリティ用の画像説明 |
| `order` | 表示順 | 数値 | Yes | |

### 2-4. site-config（サイト設定）

| 項目 | 設定値 |
|------|--------|
| API名 | site-config |
| エンドポイント | site-config |
| APIの型 | **オブジェクト形式**（リストではない。1件だけのデータ） |

**フィールド一覧:**

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|-------------|--------|------|------|------|
| `chopperTagline` | Chopperタグライン | テキストフィールド | No | Chopperページのキャッチコピー |
| `ebikeTagline` | E-Bikeタグライン | テキストフィールド | No | E-Bikeページのキャッチコピー |
| `businessHours` | 営業時間 | テキストフィールド | No | 例: 10:00 - 18:00 |
| `address` | 住所 | テキストフィールド | No | |
| `phone` | 電話番号 | テキストフィールド | No | |
| `instagramChopper` | IG Chopper URL | テキストフィールド | No | InstagramアカウントのURL |
| `instagramEbike` | IG E-Bike URL | テキストフィールド | No | |
| `announcement` | お知らせ | テキストフィールド | No | 空欄にするとサイト上で非表示になる |

### 2-5. news（お知らせ・ブログ）

| 項目 | 設定値 |
|------|--------|
| API名 | news |
| エンドポイント | news |
| APIの型 | リスト形式 |

**フィールド一覧:**

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|-------------|--------|------|------|------|
| `title` | タイトル | テキストフィールド | Yes | |
| `body` | 本文 | リッチエディタ | No | 太字・リンク・画像などを含む記事本文 |
| `publishedAt` | 公開日 | 日時 | Yes | |

---

## 3. APIキーの取得

1. ダッシュボード左メニュー → 「APIキー管理」（歯車アイコン）
2. デフォルトで1つキーが作成済み。そのキーをコピー
3. **権限設定:** 「GET」のみ許可されていることを確認（書き込みは不要）

---

## 4. Astroプロジェクトへの設定

### 4-1. SDKインストール

ターミナルで `/Users/takemac/beetle-rider` に移動して実行:

```bash
npm install microcms-js-sdk
```

### 4-2. 環境変数ファイル作成

プロジェクトルートに `.env` ファイルを作成:

```
MICROCMS_SERVICE_DOMAIN=beetle-rider
MICROCMS_API_KEY=ここにコピーしたAPIキーを貼り付け
```

> `.env` ファイルはAPIキー（秘密情報）を含むので、Gitにはアップしない。`.gitignore` に `.env` が含まれていることを確認。

### 4-3. microCMSクライアント作成

`src/lib/microcms.ts` を作成:

```typescript
import { createClient } from 'microcms-js-sdk';
import type { MicroCMSImage, MicroCMSListContent, MicroCMSObjectContent } from 'microcms-js-sdk';

// microCMSクライアント初期化
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// ---------- 型定義 ----------

export type Vehicle = {
  slug: string;
  name: string;
  base: string;
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
  order: number;
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
  chopperTagline?: string;
  ebikeTagline?: string;
  businessHours?: string;
  address?: string;
  phone?: string;
  instagramChopper?: string;
  instagramEbike?: string;
  announcement?: string;
} & MicroCMSObjectContent;

export type NewsPost = {
  title: string;
  body?: string;
  publishedAt: string;
} & MicroCMSListContent;

// ---------- データ取得関数 ----------

/** 車両一覧（order昇順） */
export async function getVehicles() {
  return await client.getList<Vehicle>({
    endpoint: 'vehicles',
    queries: { orders: 'order', limit: 10 },
  });
}

/** 車両1台（slugで取得） */
export async function getVehicleBySlug(slug: string) {
  const res = await client.getList<Vehicle>({
    endpoint: 'vehicles',
    queries: { filters: `slug[equals]${slug}`, limit: 1 },
  });
  return res.contents[0] ?? null;
}

/** 観光スポット一覧 */
export async function getDestinations(category?: 'chopper' | 'ebike' | 'both') {
  const filters = category ? `category[equals]${category}` : undefined;
  return await client.getList<Destination>({
    endpoint: 'destinations',
    queries: { filters, limit: 50 },
  });
}

/** Instagramギャラリー */
export async function getInstagramPosts(account?: 'chopper' | 'ebike') {
  const filters = account ? `account[equals]${account}` : undefined;
  return await client.getList<InstagramPost>({
    endpoint: 'instagram',
    queries: { filters, orders: 'order', limit: 50 },
  });
}

/** サイト設定（オブジェクト型） */
export async function getSiteConfig() {
  return await client.getObject<SiteConfig>({
    endpoint: 'site-config',
  });
}

/** ニュース一覧（新しい順） */
export async function getNews(limit = 10) {
  return await client.getList<NewsPost>({
    endpoint: 'news',
    queries: { orders: '-publishedAt', limit },
  });
}
```

### 4-4. Astroページでの使用例

```astro
---
// src/pages/chopper.astro
import { getVehicles } from '../lib/microcms';

const { contents: vehicles } = await getVehicles();
---

<ul>
  {vehicles.map((v) => (
    <li>
      <a href={`/chopper/${v.slug}`}>
        <img src={v.thumbnail.url} alt={v.name} />
        <h3>{v.name}</h3>
        <p>{v.base} / {v.style}</p>
        <p>DAY RIDE: ¥{v.dayRidePrice.toLocaleString()}</p>
      </a>
    </li>
  ))}
</ul>
```

---

## 5. 初期データ投入

API作成後、microCMSダッシュボードから車両6台のデータを手動登録する。

| order | slug | name | base | style | builder | dayRidePrice | multiDayPrice |
|-------|------|------|------|-------|---------|-------------|---------------|
| 1 | shortfork | SHORT FORK | '99 XLH883 | Bobber | — | 22000 | 55000 |
| 2 | saxeflames | SAXE FLAMES | '97 XLH883 | Chopper | @ryoske.14 | 22000 | 55000 |
| 3 | hellfire | HELL FIRE | '88 XLH883 | Chopper | — | 22000 | 55000 |
| 4 | leopard | LEOPARD | '99 XLH1200 | Chopper | @ryoske.14 | 22000 | 55000 |
| 5 | bruno | BRUNO | '91 XLH883 | Chopper | @ryoske.14 | 22000 | 55000 |
| 6 | gladiator | GLADIATOR | '99 XL1200 | Chopper | @ryoske.14 | 22000 | 55000 |

> 料金は仮の値。正式な料金が決まったら管理画面から変更する。
> 画像（thumbnail / gallery）はダッシュボードのフィールドにドラッグ&ドロップでアップロード。

---

## 6. 運用

- **車両情報の変更:** microCMSダッシュボード → vehicles → 該当車両を編集 → 公開
- **お知らせ追加:** news API → 新規作成 → 公開
- **ビルド:** microCMSのデータはビルド時に取得される。変更を反映するにはサイトを再ビルドする
  - 開発中: `npm run dev` で自動反映（リロード時）
  - 本番: デプロイ先（Vercel等）のWebhookをmicroCMSに設定すると、公開時に自動再ビルド

### Webhook設定（本番デプロイ後）
1. microCMSダッシュボード → 「API設定」→「Webhook」
2. デプロイ先のビルドフックURL（後述: Vercel/Netlify等）を登録
3. 「コンテンツの公開」「コンテンツの削除」にチェック
4. これでmicroCMSでデータを変更すると自動でサイトが更新される
