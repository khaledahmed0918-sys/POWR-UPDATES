export async function onRequest() {
  const username = "powrupdates";
  
  const instances = [
    "nitter.poast.org",
    "nitter.privacydev.net",
    "nitter.projectsegfau.lt",
    "nitter.cz",
    "nitter.catsarch.com",
    "nitter.salastil.com",
    "nitter.lucabased.xyz",
    "nitter.perennialte.ch",
    "nitter.woodland.cafe",
    "nitter.net"
  ];

  const fetchInstance = async (instance) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    
    try {
      const response = await fetch(`https://${instance}/${username}/rss`, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml"
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const xml = await response.text();
      const trimmed = xml.trim();
      // Strictly check if it starts with XML or RSS tags to avoid parsing HTML error pages
      if (!trimmed.startsWith("<?xml") && !trimmed.startsWith("<rss")) {
        throw new Error("Invalid XML format");
      }
      return trimmed;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  try {
    const xml = await Promise.any(instances.map(fetchInstance));
    
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      
      if (titleMatch && linkMatch) {
        items.push({
          text: titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
          url: linkMatch[1].trim(),
          date: pubDateMatch ? pubDateMatch[1].trim() : ''
        });
      }
    }
    
    return new Response(JSON.stringify(items.slice(0, 5)), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=60"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch from all Nitter instances" }), {
      status: 502,
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "access-control-allow-origin": "*"
      }
    });
  }
}
