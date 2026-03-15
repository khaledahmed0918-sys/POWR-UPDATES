import type { Channel } from '../types';

// --- IMPORTANT ---
// This is a client-side implementation.
// Kick's API is protected by Cloudflare. Direct client-side calls often fail (CORS).
// We use a rotation of CORS proxies to attempt to bypass this.

const DEFAULT_PROFILE_PIC = '';

// List of proxies to try in order. 
// "api.codetabs.com" is usually reliable.
// "api.allorigins.win" is a good fallback.
const PROXY_LIST = [
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.cors.lol/?url=${encodeURIComponent(url)}`,
    (url: string) => `https://proxy.cors.sh/${encodeURIComponent(url)}`,
    (url: string) => `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
];

/**
 * Extracts a clean username from a string, which can be a username or a full Kick URL.
 */
export const extractUsername = (input: string): string => {
    if (input.includes('kick.com/')) {
        return input.split('/').pop()?.split('?')[0].split('#')[0] || input;
    }
    return input;
};

/**
 * Helper to wait for a specified duration
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to fetch with timeout and abort signal
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 8000): Promise<Response> => {
    const { signal, ...fetchOptions } = options;
    const controller = new AbortController();
    
    // If an external signal is provided, listen to it
    if (signal) {
        signal.addEventListener('abort', () => controller.abort());
    }

    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { 
            ...fetchOptions, 
            signal: controller.signal,
            // Try to avoid sending referrer to keep traffic looking cleaner to the proxy
            referrerPolicy: 'no-referrer' 
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

/**
 * Returns a default/error channel object to prevent UI crashes
 */
const getSafeChannelObj = (username: string, error = false): Channel => ({
      username: username,
      display_name: username,
      profile_pic: DEFAULT_PROFILE_PIC,
      is_live: false,
      live_title: null,
      viewer_count: null,
      live_since: null,
      last_stream_start_time: null,
      live_url: `https://kick.com/${username}`,
      profile_url: `https://kick.com/${username}`,
      error: error,
      last_checked_at: new Date().toISOString(),
      bio: null,
      followers_count: null,
      banner_image: null,
      live_category: null,
      social_links: {},
      isLoading: false,
});

/**
 * Fetches data for a single Kick channel using multi-proxy rotation.
 */
export const fetchKickChannel = async (originalUsername: string, retryCount = 0, signal?: AbortSignal): Promise<Channel> => {
  const timestamp = Date.now();
  
  let data: any = null;
  let usedProxyIndex = -1;
  const targetUrlV2 = `https://kick.com/api/v2/channels/${originalUsername}?_=${timestamp}`;
  const targetUrlV1 = `https://kick.com/api/v1/channels/${originalUsername}?_=${timestamp}`;

  const maxAttempts = 4; // Increased attempts for higher reliability

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Fire all proxy requests concurrently to get the fastest successful response
      const promises = PROXY_LIST.map(async (proxyFn, i) => {
        const urlToFetch = i === 1 ? targetUrlV1 : targetUrlV2;
        const proxyUrl = proxyFn(urlToFetch, originalUsername);
        
        // Use a slightly longer timeout for initial attempts, then shorter
        const timeout = attempt === 0 ? 5000 : 3000;
        
        const response = await fetchWithTimeout(proxyUrl, { signal }, timeout);
        if (response.status === 404) {
            throw new Error(`404`);
        }
        if (response.ok) {
            const result = await response.json();
            if (result && result.user) {
                return { data: result, index: i };
            }
        }
        throw new Error(`Failed`);
      });

      const result = await Promise.any(promises);
      
      data = result.data;
      usedProxyIndex = result.index;
      break; // Success! We got the data.
    } catch (e: any) {
      // Check if all proxies returned 404
      if (e instanceof AggregateError || e.errors) {
        const errors = e.errors || [];
        const all404 = errors.length > 0 && errors.every((err: any) => err.message === '404');
        if (all404) {
          return getSafeChannelObj(originalUsername, false);
        }
      }
      
      // All proxies failed in this attempt
      if (attempt < maxAttempts - 1) {
        await wait(500); // Wait 500ms before retry
      }
    }
  }

  // If no data found after all proxies and all attempts
  if (!data || !data.user) {
      return getSafeChannelObj(originalUsername, true);
  }

  // 2. Process Data
  try {
      const isLive = data.livestream !== null && data.livestream !== undefined;
      let lastStreamStartTime = null;

      // Try fetching previous livestreams/videos if not live to get "Last Seen" data
      if (!isLive) {
          // Strategy A: Check data.previous_livestreams (often included in channel payload)
          if (data.previous_livestreams && data.previous_livestreams.length > 0) {
              lastStreamStartTime = data.previous_livestreams[0].created_at || data.previous_livestreams[0].start_time;
          }
          // We DO NOT fetch the videos endpoint here anymore. It blocks the UI.
          // It will be fetched in the background by StreamerContext.
      }

      const socialLinks: { [key: string]: string } = {};
      
      // Helper to format social links correctly
      const formatSocialLink = (platform: string, handle: string) => {
          if (!handle || typeof handle !== 'string') return null;
          handle = handle.trim();
          if (handle === '') return null;
          
          const lowerHandle = handle.toLowerCase();
          if (lowerHandle === 'null' || lowerHandle === 'undefined' || lowerHandle === 'none' || lowerHandle === 'false') return null;

          if (handle.startsWith('http')) return handle;
          
          switch(platform) {
              case 'twitter': return `https://twitter.com/${handle.replace('@', '')}`;
              case 'instagram': return `https://instagram.com/${handle.replace('@', '')}`;
              case 'youtube': return `https://youtube.com/${handle.startsWith('@') ? handle : '@'+handle}`;
              case 'tiktok': return `https://tiktok.com/${handle.startsWith('@') ? handle : '@'+handle}`;
              case 'discord': return handle.includes('discord.gg') ? handle : `https://discord.gg/${handle}`;
              default: return handle;
          }
      };

      if (data.user?.twitter) {
          const link = formatSocialLink('twitter', data.user.twitter);
          if (link) socialLinks.twitter = link;
      }
      if (data.user?.youtube) {
          const link = formatSocialLink('youtube', data.user.youtube);
          if (link) socialLinks.youtube = link;
      }
      if (data.user?.instagram) {
          const link = formatSocialLink('instagram', data.user.instagram);
          if (link) socialLinks.instagram = link;
      }
      if (data.user?.discord) {
          const link = formatSocialLink('discord', data.user.discord);
          if (link) socialLinks.discord = link;
      }
      if (data.user?.tiktok) {
          const link = formatSocialLink('tiktok', data.user.tiktok);
          if (link) socialLinks.tiktok = link;
      }

      const followersCount = data.followers_count ?? data.followersCount ?? data.user?.followers_count ?? 0;
      
      // Banner image can be in root or user object
      const bannerImage = data.banner_image?.url || data.user?.banner_image?.url || data.banner_image || data.user?.banner_image || null;

      return {
          username: originalUsername,
          display_name: data.user.username || originalUsername, 
          profile_pic: data.user.profile_pic || DEFAULT_PROFILE_PIC,
          is_live: isLive,
          live_title: data.livestream?.session_title || null,
          viewer_count: data.livestream?.viewer_count ?? null,
          live_since: data.livestream?.start_time || null,
          last_stream_start_time: lastStreamStartTime,
          live_url: `https://kick.com/${originalUsername}`,
          profile_url: `https://kick.com/${originalUsername}`,
          bio: data.user.bio || null,
          followers_count: Number(followersCount),
          banner_image: bannerImage,
          live_category: data.livestream?.category?.name || null,
          social_links: socialLinks,
          isLoading: false,
          last_checked_at: new Date().toISOString(),
      };

  } catch (error) {
      return getSafeChannelObj(originalUsername, true);
  }
};

/**
 * Legacy support
 */
export const fetchChannelStatuses = async (streamers: any[]) => {
    return { checked_at: new Date().toISOString(), data: [] };
};

/**
 * Fetches the last stream time in the background so it doesn't block the main UI
 */
export const fetchLastStreamTime = async (username: string, signal?: AbortSignal): Promise<string | null> => {
    const timestamp = Date.now();
    const videosUrl = `https://kick.com/api/v2/channels/${username}/videos?_=${timestamp}`;
    
    // Try proxies sequentially for background task
    for (const proxyFn of PROXY_LIST) {
        try {
            const response = await fetchWithTimeout(proxyFn(videosUrl, username), { signal }, 4000);
            if (response.ok) {
                const vData = await response.json();
                if (vData && vData.length > 0) {
                    return vData[0].created_at || vData[0].start_time || null;
                }
                return null; // Empty array means no videos
            }
        } catch (e) { 
            continue; 
        }
    }
    return null;
};
