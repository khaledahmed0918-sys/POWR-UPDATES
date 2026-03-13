export async function onRequest() {
  const username = "powrupdates";

  try {
    const response = await fetch(`https://nitter.net/${username}/rss`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
      return new Response(`Error fetching RSS: ${response.status}`, { status: response.status });
    }

    const xml = await response.text();

    return new Response(xml, {
      headers: {
        "content-type": "application/xml;charset=UTF-8",
        "access-control-allow-origin": "*"
      }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
