// Only the retired paths in _routes.json invoke this worker.
const gone = new Set([
  '/url-parser', '/url-parser/', '/url-parser.html',
  '/html-to-url-encoding', '/html-to-url-encoding/', '/html-to-url-encoding.html'
]);
export default {
  async fetch(request, env) {
    if (gone.has(new URL(request.url).pathname)) {
      return new Response(request.method === 'HEAD' ? null : 'Gone\n', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'X-Robots-Tag': 'noindex'
        }
      });
    }
    return env.ASSETS.fetch(request);
  }
};
