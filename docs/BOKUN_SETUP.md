# Bokun 統合ガイド

BEETLE RIDER 予約サイト（Astro）にJTB Bokunの予約ウィジェットを埋め込む設計と手順。

---

## 概要

- **Bokun** = JTBグループの予約エンジン。商品（体験・レンタル）を作成し、予約ウィジェット（埋め込みコード）をサイトに貼る
- サイト側はウィジェットを表示するだけ。決済・在庫管理・予約確認はすべてBokun側で処理
- ウィジェットはJavaScriptスニペットで、Astroコンポーネントとしてラップする

---

## 1. 商品構成

### E-BIKE（3商品）

| 商品名 | 料金 | 内容 |
|--------|------|------|
| QUICK RIDE | ¥3,500 | 短時間レンタル |
| CRUISE | ¥5,000 | 半日レンタル |
| ALL DAY | ¥7,500 | 終日レンタル |

**オプション:**
- 車両保険: +¥1,000（E-BIKEのみ）

### CHOPPER DAY RIDE（6商品 — 車両ごと）

| 商品名 | 料金 |
|--------|------|
| DAY RIDE — SHORT FORK | ¥22,000〜 |
| DAY RIDE — SAXE FLAMES | ¥22,000〜 |
| DAY RIDE — HELL FIRE | ¥22,000〜 |
| DAY RIDE — LEOPARD | ¥22,000〜 |
| DAY RIDE — BRUNO | ¥22,000〜 |
| DAY RIDE — GLADIATOR | ¥22,000〜 |

### CHOPPER MULTI-DAY（6商品 — 車両ごと）

| 商品名 | 料金 | 備考 |
|--------|------|------|
| MULTI-DAY — SHORT FORK | ¥55,000〜 | リクエスト制（即時予約ではない） |
| MULTI-DAY — SAXE FLAMES | ¥55,000〜 | 同上 |
| MULTI-DAY — HELL FIRE | ¥55,000〜 | 同上 |
| MULTI-DAY — LEOPARD | ¥55,000〜 | 同上 |
| MULTI-DAY — BRUNO | ¥55,000〜 | 同上 |
| MULTI-DAY — GLADIATOR | ¥55,000〜 | 同上 |

### 全商品共通の付帯品

以下はレンタル料金に含まれる（Bokunの商品説明に明記）:
- ヘルメット
- グローブ
- フォンホルダーマウント
- ETC車載器（Chopperのみ）

---

## 2. Bokunでの商品作成手順

### 2-1. ログイン

1. https://bokun.io にアクセス
2. 既存アカウントでログイン

### 2-2. E-BIKE商品を作成（3つ）

1. 左メニュー「Products」→「+Create Product」
2. 商品タイプ: 「Day Tour」または「Rental」を選択
3. 基本情報を入力:
   - **Title:** `E-BIKE QUICK RIDE` (英語)
   - **Description:** プランの説明（所要時間・含まれるもの・注意事項）
   - **Price:** ¥3,500
   - **Currency:** JPY
4. 「Availability」（空き設定）:
   - 営業時間に合わせてスロットを設定
   - 台数に応じて定員を設定
5. 「Extras」（オプション）:
   - 「+Add Extra」→ 名前: `Vehicle Insurance` / 料金: ¥1,000
6. 「Save」して「Publish」（公開）
7. CRUISE (¥5,000)、ALL DAY (¥7,500) も同様に作成

### 2-3. CHOPPER DAY RIDE商品を作成（6つ）

1. 「+Create Product」
2. 基本情報:
   - **Title:** `CHOPPER DAY RIDE — SHORT FORK`
   - **Description:** 車両スペック・ツアー内容・必要免許の説明
   - **Price:** ¥22,000
3. 「Availability」:
   - 1日1台のみ（定員: 1）
   - 営業日カレンダーを設定
4. 「Save」→「Publish」
5. 残り5台分も同様に作成（車名とスペックを変えるだけ）

### 2-4. CHOPPER MULTI-DAY商品を作成（6つ）

1. 「+Create Product」
2. 基本情報:
   - **Title:** `CHOPPER MULTI-DAY — SHORT FORK`
   - **Description:** 複数日レンタルの内容・条件
   - **Price:** ¥55,000
3. **予約方式:** 「Request Only」（リクエスト制）に設定
   - Bokunの設定で「Confirmation Required」をONにする
   - これにより、予約リクエスト→TAKE側で承認→確定 のフローになる
4. 残り5台分も同様に作成

---

## 3. ウィジェットコードの取得

商品ごとにウィジェットの埋め込みコードを取得する。

1. Bokunダッシュボード → 「Products」 → 対象商品をクリック
2. 「Booking Widget」または「Embed」タブを開く
3. 「Widget Type」で以下を選択:
   - **Calendar Widget**（カレンダー型）: 日付選択→予約
   - または **Button Widget**（ボタン型）: クリックでポップアップ
4. 表示されるコードをコピー

コードの例:
```html
<div id="bokun-w12345_abcdef"></div>
<script src="https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js?bookingChannelUUID=YOUR_CHANNEL_UUID" async></script>
<script>
  var defined = setInterval(function() {
    if (typeof BokunWidgetsLoader !== 'undefined') {
      clearInterval(defined);
      BokunWidgetsLoader.init({
        widgetId: 'w12345_abcdef'
      });
    }
  }, 100);
</script>
```

5. このコードから以下の2つの値を控える:
   - **widgetId:** `w12345_abcdef` の部分
   - **bookingChannelUUID:** URLに含まれるUUID

6. 全15商品（E-BIKE 3 + DAY RIDE 6 + MULTI-DAY 6）分のwidgetIdを取得する

---

## 4. Astroでの実装

### 4-1. 環境変数

`.env` に追加:

```
BOKUN_CHANNEL_UUID=ここにbookingChannelUUIDを貼り付け
```

> 商品ごとのwidgetIdはmicroCMSの `bokunDayRideId` / `bokunMultiDayId` フィールドに保存する。
> E-BIKEのwidgetIdは `src/lib/bokun.ts` に定数として定義する（microCMSにE-BIKE用フィールドがないため）。

### 4-2. Bokunウィジェットコンポーネント

`src/components/BokunWidget.astro` を作成:

```astro
---
interface Props {
  widgetId: string;
  class?: string;
}

const { widgetId, class: className } = Astro.props;
const channelUUID = import.meta.env.BOKUN_CHANNEL_UUID;
---

<div class:list={['bokun-widget-wrapper', className]}>
  <div id={`bokun-${widgetId}`}></div>
</div>

<script
  src={`https://widgets.bokun.io/assets/javascripts/apps/build/BokunWidgetsLoader.js?bookingChannelUUID=${channelUUID}`}
  async
></script>

<script define:vars={{ widgetId }}>
  var defined = setInterval(function() {
    if (typeof BokunWidgetsLoader !== 'undefined') {
      clearInterval(defined);
      BokunWidgetsLoader.init({ widgetId: widgetId });
    }
  }, 100);
</script>

<style>
  .bokun-widget-wrapper {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }

  .bokun-widget-wrapper :global(iframe) {
    width: 100%;
    aspect-ratio: 3 / 4;
    border: none;
  }
</style>
```

### 4-3. BOOK NOWボタン（モーダル方式）

ウィジェットをモーダル（ポップアップ）で開く場合:

`src/components/BookNowButton.astro`:

```astro
---
interface Props {
  widgetId: string;
  label?: string;
  class?: string;
}

const { widgetId, label = 'BOOK NOW', class: className } = Astro.props;
---

<button
  class:list={['book-now-btn', className]}
  data-bokun-widget={widgetId}
>
  {label}
</button>

<dialog id={`dialog-${widgetId}`} class="bokun-dialog">
  <div class="dialog-inner">
    <button class="dialog-close" aria-label="Close">&times;</button>
    <div id={`bokun-${widgetId}`}></div>
  </div>
</dialog>

<script define:vars={{ widgetId }}>
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector(`[data-bokun-widget="${widgetId}"]`);
    const dialog = document.getElementById(`dialog-${widgetId}`);

    btn?.addEventListener('click', () => {
      dialog?.showModal();
    });

    dialog?.querySelector('.dialog-close')?.addEventListener('click', () => {
      dialog?.close();
    });

    dialog?.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  });
</script>

<style>
  .book-now-btn {
    cursor: pointer;
  }

  .bokun-dialog {
    padding: 0;
    border: none;
    border-radius: 12px;
    max-width: 520px;
    width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    background: #fff;
  }

  .bokun-dialog::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }

  .dialog-inner {
    position: relative;
    padding: 24px;
  }

  .dialog-close {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
  }
</style>
```

### 4-4. ページでの使用例

```astro
---
// src/pages/chopper/[slug].astro
import { getVehicles, getVehicleBySlug } from '../../lib/microcms';
import BookNowButton from '../../components/BookNowButton.astro';

export async function getStaticPaths() {
  const { contents } = await getVehicles();
  return contents.map((v) => ({ params: { slug: v.slug }, props: { vehicle: v } }));
}

const { vehicle } = Astro.props;
---

<h1>{vehicle.name}</h1>
<p>{vehicle.base} / {vehicle.style}</p>

<!-- DAY RIDE予約ボタン -->
{vehicle.bokunDayRideId && (
  <BookNowButton
    widgetId={vehicle.bokunDayRideId}
    label={`BOOK DAY RIDE — ¥${vehicle.dayRidePrice.toLocaleString()}`}
    class="bg-[#C30D23] text-white px-8 py-4 rounded-lg font-bold text-lg"
  />
)}

<!-- MULTI-DAY予約ボタン -->
{vehicle.bokunMultiDayId && (
  <BookNowButton
    widgetId={vehicle.bokunMultiDayId}
    label={`REQUEST MULTI-DAY — ¥${vehicle.multiDayPrice.toLocaleString()}`}
    class="border-2 border-[#C30D23] text-[#C30D23] px-8 py-4 rounded-lg font-bold text-lg"
  />
)}
```

### 4-5. E-BIKE予約のwidgetId定義

`src/lib/bokun.ts`:

```typescript
/** Bokun E-BIKE ウィジェットID（商品作成後に埋める） */
export const EBIKE_WIDGETS = {
  quickRide: '',   // ← Bokunで取得したwidgetIdを貼る
  cruise: '',      // ← 同上
  allDay: '',      // ← 同上
} as const;
```

---

## 5. microCMSにwidgetIdを登録

Bokunで全商品を作成し、widgetIdを取得したら:

1. microCMSダッシュボード → vehicles → 各車両を編集
2. `bokunDayRideId` フィールドに該当するDAY RIDEのwidgetIdを入力
3. `bokunMultiDayId` フィールドにMULTI-DAYのwidgetIdを入力
4. 「公開」をクリック
5. 6台すべてに設定

---

## 6. テスト

1. `npm run dev` でローカルサーバーを起動
2. 各車両詳細ページで「BOOK NOW」ボタンをクリック
3. モーダルが開き、Bokunのカレンダーが表示されることを確認
4. テスト予約を実行し、Bokunダッシュボードに予約が届くことを確認

### チェックリスト

- [ ] E-BIKE 3プランの予約ウィジェットが動作する
- [ ] CHOPPER DAY RIDE 6台の予約ウィジェットが動作する
- [ ] CHOPPER MULTI-DAY 6台がリクエスト制で動作する
- [ ] モバイルでモーダルが正しく表示される
- [ ] 車両保険オプション（E-BIKE）が選択できる
- [ ] Bokunダッシュボードにテスト予約が届く

---

## 7. 本番運用の注意点

- **Bokunの料金変更:** Bokun側で商品の価格を変更する。サイト上の表示価格はmicroCMSの `dayRidePrice` / `multiDayPrice` を変更する。**両方を必ず同時に更新すること**（ズレると混乱する）
- **ウィジェットの読み込み速度:** BokunのJSは外部スクリプトなので初回読み込みに1-2秒かかる。ボタンクリック後のモーダル内で読み込むため、ページ表示自体には影響しない
- **多言語:** Bokunウィジェットは予約者のブラウザ言語に応じて自動的に言語切替される
- **MULTI-DAYのリクエスト制:** 予約リクエストが入ったらBokunから通知メールが届く。Bokunダッシュボードで「Accept」または「Decline」する
