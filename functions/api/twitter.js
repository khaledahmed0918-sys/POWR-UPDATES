export async function onRequest() {
  const username = "powrupdates";
  
  // nitter.net is frequently down or blocked. We use a list of active instances.
  const instances = [
    "nitter.poast.org",
    "nitter.privacydev.net",
    "nitter.projectsegfau.lt",
    "nitter.net"
  ];

  let lastError = "";

  for (const instance of instances) {
    try {
      const response = await fetch(`https://${instance}/${username}/rss`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml"
        },
        // Cloudflare specific fetch options to cache the response
        cf: {
          cacheTtl: 60,
          cacheEverything: true
        }
      });

      if (response.ok) {
        const xml = await response.text();
        // Basic validation to ensure it's actually XML/RSS and not an HTML error page or Cloudflare challenge
        if (xml.includes("<rss") || xml.includes("<feed")) {
          return new Response(xml, {
            headers: {
              "content-type": "application/xml;charset=UTF-8",
              "access-control-allow-origin": "*",
              "cache-control": "public, max-age=60"
            }
          });
        }
      }
      lastError = `Instance ${instance} returned ${response.status}`;
    } catch (error) {
      lastError = `Instance ${instance} failed: ${error.message}`;
      continue; // Try the next instance
    }
  }

  // If all instances fail, return a 502 Bad Gateway with the last error
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><error><message>All Nitter instances failed</message><details>${lastError}</details></error>`, { 
    status: 502,
    headers: {
      "content-type": "application/xml;charset=UTF-8",
      "access-control-allow-origin": "*"
    }
  });
}
