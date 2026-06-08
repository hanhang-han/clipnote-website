// functions/[[path]].ts
// Cloudflare Pages Functions middleware for SEO prerender hints

interface Env {
  // Add environment bindings here if needed
}

export async function onRequest(context: EventContext<Env, string, Record<string, string>>) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Static assets: pass through directly
  if (url.pathname.match(/\.(html|xml|txt|png|jpg|jpeg|gif|svg|ico|css|js|mp4|webp|dmg|json|woff2?|ttf|eot)$/i)) {
    return next();
  }

  const ua = request.headers.get('user-agent') || '';
  const bots = /googlebot|bingbot|baiduspider|slurp|duckduckbot|yandexbot|facebookexternalhit|twitterbot|linkedinbot|applebot|bytespider|sogou|360spider/i;

  if (bots.test(ua)) {
    // For crawlers, return HTML with prerender hint injected
    const response = await next();
    const html = await response.text();

    // Inject prerender meta tag before </head>
    const inject = `
    <meta name="fragment" content="!">
    `;

    const modified = html.replace('</head>', inject + '</head>');
    return new Response(modified, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  return next();
}
