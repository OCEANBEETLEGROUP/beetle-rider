/**
 * BEETLE RIDER — UTM/ClickID Persistence & Bokun Attribution Bridge
 *
 * 目的:
 *   1. サイト訪問時にURLから utm_*, gclid, fbclid 等を取得し localStorage に保存
 *   2. ユーザーがサイト内を巡回しても誘導元情報・広告クリックIDを保持
 *   3. BookNow ボタンがクリックされた瞬間に Bokun checkout URL へ全部渡し、
 *      Bokun booking_questions の以下を pre-fill する:
 *        - "How did you find us?" (顧客の自己申告チャネル / OPTIONS)
 *        - "Google Click ID" (gclid / hidden / Google Ads Offline CV用)
 *        - "Meta Click ID" (fbclid / hidden / Meta CAPI fbc構成用)
 *
 * 配置:
 *   - <head> または <body> 末尾の <script src="/utm-tracker.js" defer></script>
 *
 * 依存: なし（バニラJS）
 *
 * 関連:
 *   - apply_rental_questions.py が Bokun側に "How did you find us?" (5/19) と
 *     "Google Click ID" / "Meta Click ID" (5/25) 質問を追加
 *   - Cloudflare Worker `beetle-rider-webhook` が予約時にこれらの値を読み取り
 *     Google Ads Offline Conversion + Meta CAPI に送信 (Phase 2)
 *   - growth-report スキルが Bokun_raw.csv の referral_source 列を週次集計
 *
 * 作成: 2026-05-19  /  Phase 2拡張: 2026-05-25
 */

(function () {
  'use strict';

  // ─── 設定 ─────────────────────────────────────────────
  const STORAGE_KEY = 'beetlerider_utm';
  const TTL_DAYS = 30;
  const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  // 広告クリックID: gclid=Google Ads, fbclid=Meta Ads, wbraid/gbraid=Google App, msclkid=MS Ads
  // → Phase 2 (Bokun→広告CV連携) で Worker → Google Ads Offline CV / Meta CAPI に送信
  const CLICK_ID_PARAMS = ['gclid', 'fbclid', 'wbraid', 'gbraid', 'msclkid'];
  const BOKUN_DOMAINS = ['booking.beetlerider.com', 'widgets.bokun.io', 'beetlerider.bokun.io'];

  // Bokun booking-question への pre-fill用クエリパラメータ名
  // Bokun は ?customField_<label_slug>=<value> 形式で OPTIONS 質問を pre-fill する
  const BOKUN_QUERY_KEYS = {
    referral: 'customField_referral_source',
    gclid: 'customField_gclid',
    fbclid: 'customField_fbclid',
  };

  // ─── ユーティリティ ───────────────────────────────────
  function nowMs() { return Date.now(); }
  function daysToMs(d) { return d * 24 * 60 * 60 * 1000; }

  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    UTM_PARAMS.forEach(k => {
      const v = params.get(k);
      if (v) utm[k] = v;
    });
    const click_ids = {};
    CLICK_ID_PARAMS.forEach(k => {
      const v = params.get(k);
      if (v) click_ids[k] = v;
    });
    if (Object.keys(utm).length === 0 && Object.keys(click_ids).length === 0) return null;
    return { utm, click_ids };
  }

  function saveAttribution(data) {
    try {
      const existing = loadAttribution();
      const payload = {
        utm: data.utm && Object.keys(data.utm).length > 0 ? data.utm : (existing && existing.utm) || {},
        click_ids: data.click_ids && Object.keys(data.click_ids).length > 0 ? data.click_ids : (existing && existing.click_ids) || {},
        first_landing: (existing && existing.first_landing) || window.location.pathname,
        first_referrer: (existing && existing.first_referrer) || document.referrer || '',
        saved_at: nowMs(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('[utm-tracker] localStorage save failed', e);
    }
  }

  function loadAttribution() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      if (nowMs() - payload.saved_at > daysToMs(TTL_DAYS)) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      // 旧スキーマ (utm only) との互換性
      if (!payload.click_ids) payload.click_ids = {};
      return payload;
    } catch (e) {
      return null;
    }
  }

  // utm_source/medium から referral_source 質問のvalueに変換
  // Bokun側のOPTIONS valueと一致させる
  function mapToReferralValue(utm, clickIds) {
    if (!utm && !clickIds) return null;
    const src = (utm && utm.utm_source || '').toLowerCase();
    const med = (utm && utm.utm_medium || '').toLowerCase();

    // 広告クリックIDがあれば自動判定（utmより信頼度高い）
    if (clickIds && clickIds.gclid) return 'google_search';
    if (clickIds && clickIds.fbclid) return 'instagram';  // FacebookよりもIG広告経由のほうが圧倒的に多い実態

    if (src === 'ig' || src === 'instagram') return 'instagram';
    if (src === 'facebook' || src === 'fb') return 'facebook';
    if (src === 'tiktok') return 'tiktok';
    if (src === 'youtube') return 'youtube';
    if (src === 'google') return 'google_search';
    if (src === 'gmap' || src === 'gbp' || med === 'maps') return 'google_maps';
    return null;
  }

  // ─── BookNow ボタンの URL 改変 ────────────────────────
  function rewriteBokunLinks() {
    const attr = loadAttribution();
    if (!attr) return;
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      let url;
      try { url = new URL(link.href); } catch (e) { return; }
      const isBokun = BOKUN_DOMAINS.some(d => url.hostname.endsWith(d));
      if (!isBokun) return;

      // utm パラメータ全付与
      if (attr.utm) {
        Object.entries(attr.utm).forEach(([k, v]) => {
          if (!url.searchParams.has(k)) url.searchParams.set(k, v);
        });
      }

      // 広告クリックIDも付与（後で Bokun pre-fill, Worker側で読取り）
      if (attr.click_ids) {
        Object.entries(attr.click_ids).forEach(([k, v]) => {
          if (!url.searchParams.has(k)) url.searchParams.set(k, v);
        });
      }

      // referral 質問への pre-fill (顧客自己申告チャネル)
      const refVal = mapToReferralValue(attr.utm, attr.click_ids);
      if (refVal && !url.searchParams.has(BOKUN_QUERY_KEYS.referral)) {
        url.searchParams.set(BOKUN_QUERY_KEYS.referral, refVal);
      }

      // Google Click ID をBokun hidden質問に渡す (Google Ads Offline CV用)
      if (attr.click_ids && attr.click_ids.gclid && !url.searchParams.has(BOKUN_QUERY_KEYS.gclid)) {
        url.searchParams.set(BOKUN_QUERY_KEYS.gclid, attr.click_ids.gclid);
      }

      // Meta Click ID (fbclid) をBokun hidden質問に渡す (Meta CAPI fbc構成用)
      if (attr.click_ids && attr.click_ids.fbclid && !url.searchParams.has(BOKUN_QUERY_KEYS.fbclid)) {
        url.searchParams.set(BOKUN_QUERY_KEYS.fbclid, attr.click_ids.fbclid);
      }

      // first_landing も渡す
      if (attr.first_landing && !url.searchParams.has('first_landing')) {
        url.searchParams.set('first_landing', attr.first_landing);
      }

      link.href = url.toString();
    });
  }

  // ─── GA4 への配信（オプション・gtag が居れば送信）────
  function sendGtagEvent(data) {
    if (typeof gtag !== 'function') return;
    if (data.utm && Object.keys(data.utm).length > 0) {
      gtag('event', 'utm_landing', {
        utm_source: data.utm.utm_source || '',
        utm_medium: data.utm.utm_medium || '',
        utm_campaign: data.utm.utm_campaign || '',
      });
    }
  }

  // ─── 初期化 ───────────────────────────────────────────
  function init() {
    const fresh = getUrlParams();
    if (fresh) {
      saveAttribution(fresh);
      sendGtagEvent(fresh);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', rewriteBokunLinks);
    } else {
      rewriteBokunLinks();
    }
    window.addEventListener('astro:after-swap', rewriteBokunLinks);
  }

  init();
})();
