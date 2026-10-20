export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const productionHosts = ['trinomamall.com', 'www.trinomamall.com'];
    if (productionHosts.includes(url.hostname) && (url.protocol !== 'https:' || url.hostname !== productionHosts[0])) {
      url.protocol = 'https:';
      url.hostname = productionHosts[0];
      url.port = '';
      return Response.redirect(url.href, 301);
    }
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, follow');
    return new Response(response.body, {status: 404, statusText: 'Not Found', headers});
  },
};
