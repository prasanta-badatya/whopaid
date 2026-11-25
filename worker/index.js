// Serves the WhoPaid Angular build under https://allvo.in/whopaid/.
// Static assets live at the root of dist/split-karo, so /whopaid/* requests
// have the prefix stripped before being looked up in the ASSETS binding.

const PREFIX = '/whopaid';
const LEGACY_PREFIX = '/who-paid';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // /who-paid and /who-paid/* -> same path under /whopaid
    if (path === LEGACY_PREFIX || path.startsWith(LEGACY_PREFIX + '/')) {
      url.pathname = PREFIX + path.slice(LEGACY_PREFIX.length);
      return Response.redirect(url.toString(), 301);
    }

    // /whopaid -> /whopaid/ so relative URLs resolve against the base href
    if (path === PREFIX) {
      url.pathname = PREFIX + '/';
      return Response.redirect(url.toString(), 301);
    }

    // /whopaid/* -> asset lookup without the prefix
    if (path.startsWith(PREFIX + '/')) {
      url.pathname = path.slice(PREFIX.length);
      return env.ASSETS.fetch(new Request(url, request));
    }

    return env.ASSETS.fetch(request);
  },
};
