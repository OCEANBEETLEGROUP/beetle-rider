/**
 * Cloudflare Pages Middleware — GeoIP language redirect
 *
 * Logic:
 * 1. If URL already has /en/ prefix → pass through (user chose English)
 * 2. If cookie "lang" is set → respect it (user made a choice)
 * 3. If visitor is from Japan (CF-IPCountry: JP) → pass through (default JA)
 * 4. If visitor is NOT from Japan and no cookie → redirect to /en/ version
 * 5. When user clicks JP/EN button → set cookie via query param ?lang=ja or ?lang=en
 */

interface Env {}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // Handle language preference setting via query param
  const langParam = url.searchParams.get('lang');
  if (langParam === 'ja' || langParam === 'en') {
    // Remove the query param and redirect
    url.searchParams.delete('lang');

    let targetPath = url.pathname;
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

  // Already on /en/ path → pass through
  if (url.pathname.startsWith('/en')) {
    return context.next();
  }

  // Check cookie
  const cookieHeader = request.headers.get('Cookie') || '';
  const langCookie = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('lang='));

  if (langCookie) {
    const cookieLang = langCookie.split('=')[1];
    if (cookieLang === 'en') {
      // User previously chose EN but is on JA path → redirect
      return new Response(null, {
        status: 302,
        headers: { Location: '/en' + url.pathname },
      });
    }
    // Cookie says 'ja' → pass through
    return context.next();
  }

  // No cookie → check GeoIP
  const country = request.headers.get('CF-IPCountry') || 'JP';

  if (country !== 'JP') {
    // Non-Japan visitor, first visit → redirect to /en/ and set cookie
    const response = new Response(null, {
      status: 302,
      headers: { Location: '/en' + url.pathname },
    });
    response.headers.set(
      'Set-Cookie',
      `lang=en; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`
    );
    return response;
  }

  // Japan visitor → pass through, set cookie
  const response = await context.next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set(
    'Set-Cookie',
    `lang=ja; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`
  );
  return newResponse;
};
