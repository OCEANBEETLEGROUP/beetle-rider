/**
 * Cloudflare Pages Middleware — GeoIP language redirect
 *
 * Only applies to HTML page requests (not assets).
 * Sets a cookie to remember the user's language preference.
 */

interface Env {}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip static assets, sitemaps, favicons, manifest — only process HTML page requests
  if (
    path.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|mp4|mov|m4v|json|xml|txt|map|webmanifest)$/) ||
    path.startsWith('/assets/') ||
    path.startsWith('/_astro/') ||
    path.startsWith('/sitemap') ||
    path === '/robots.txt' ||
    path === '/favicon.svg' ||
    path === '/favicon.ico' ||
    path === '/site.webmanifest' ||
    path.startsWith('/favicon-') ||
    path === '/apple-touch-icon.png'
  ) {
    return context.next();
  }

  // Handle language preference setting via query param (?lang=ja or ?lang=en)
  const langParam = url.searchParams.get('lang');
  if (langParam === 'ja' || langParam === 'en') {
    url.searchParams.delete('lang');

    let targetPath = path;
    if (langParam === 'ja' && targetPath.startsWith('/en')) {
      targetPath = targetPath.replace(/^\/en/, '') || '/';
    } else if (langParam === 'en' && !targetPath.startsWith('/en')) {
      targetPath = '/en' + targetPath;
    }
    url.pathname = targetPath;

    const response = new Response(null, {
      status: 302,
      headers: { Location: url.toString() },
    });
    response.headers.set(
      'Set-Cookie',
      `lang=${langParam}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`
    );
    return response;
  }

  // Already on /en/ path → pass through (no redirect)
  if (path.startsWith('/en')) {
    return context.next();
  }

  // On JA path — check if we should redirect to EN
  const cookieHeader = request.headers.get('Cookie') || '';
  const langCookie = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('lang='));

  if (langCookie) {
    // User has a preference cookie — respect it, don't redirect
    // If cookie=en but they navigated to JA URL directly, let them stay
    // (they can use the JP/EN button to switch)
    return context.next();
  }

  // No cookie → first visit. Check GeoIP
  const country = request.headers.get('CF-IPCountry') || 'JP';

  if (country !== 'JP') {
    // Non-Japan first visit → redirect to /en/ and set cookie
    const response = new Response(null, {
      status: 302,
      headers: { Location: '/en' + path },
    });
    response.headers.set(
      'Set-Cookie',
      `lang=en; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`
    );
    return response;
  }

  // Japan first visit → pass through, set cookie
  const response = await context.next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set(
    'Set-Cookie',
    `lang=ja; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`
  );
  return newResponse;
};
