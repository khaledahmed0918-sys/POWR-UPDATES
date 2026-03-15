import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Channel } from '../types';
import { fetchKickChannel, fetchLastStreamTime } from '../services/kickService';
import { streamersList } from '../data/streamers';

interface StreamerContextType {
  streamers: Channel[];
  loading: boolean;
  refreshStreamers: () => Promise<void>;
  retryStreamer: (username: string) => Promise<void>;
}

const StreamerContext = createContext<StreamerContextType | undefined>(undefined);

export const StreamerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streamers, setStreamers] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const failedStreamersRef = useRef<Set<string>>(new Set());

  const fetchStreamerData = useCallback(async (username: string, signal?: AbortSignal) => {
    try {
      return await fetchKickChannel(username, 0, signal);
    } catch (error) {
      return {
        username,
        display_name: username,
        is_live: false,
        error: true,
        isLoading: false,
        profile_pic: '',
        live_url: `https://kick.com/${username}`,
        profile_url: `https://kick.com/${username}`,
        social_links: {},
        last_checked_at: new Date().toISOString(),
      } as Channel;
    }
  }, []);

  const refreshStreamers = useCallback(async () => {
    // Cancel any ongoing fetches from previous renders/calls to free up network
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    setLoading(true);
    
    // Always start fresh with skeletons (No Caching)
    const initialSkeletons = streamersList.map(username => ({
      username,
      display_name: username,
      is_live: false,
      error: false,
      isLoading: true,
      profile_pic: '',
      live_url: `https://kick.com/${username}`,
      profile_url: `https://kick.com/${username}`,
      social_links: {},
      last_checked_at: new Date().toISOString(),
    } as Channel));
    setStreamers(initialSkeletons);
    
    // Initialize failed streamers
    failedStreamersRef.current = new Set(streamersList);

    while (true) {
        if (signal.aborted) return;
        
        try {
          const queue = [...failedStreamersRef.current];
          const retryQueue: string[] = [];
          const CONCURRENCY = 6; // Increased concurrency for faster initial load
          
          const worker = async () => {
            while (queue.length > 0 || retryQueue.length > 0) {
              if (signal.aborted) return;
              
              let username: string | undefined;
              let isRetry = false;
              
              if (queue.length > 0) {
                  username = queue.shift();
              } else if (retryQueue.length > 0) {
                  username = retryQueue.shift();
                  isRetry = true;
                  // Wait longer for retries to let proxies cool down
                  await new Promise(resolve => setTimeout(resolve, 1000));
              }

              if (username) {
                const data = await fetchStreamerData(username, signal);
                
                if (signal.aborted) return;
                
                if (data.error && !isRetry) {
                    // Failed first time, push to retry queue
                    retryQueue.push(username);
                    continue; // Don't update UI with error yet
                }
                
                // Update UI immediately for this specific streamer so user doesn't wait
                setStreamers(prev => prev.map(s => s.username === username ? data : s));
                
                // Background fetch for last stream time if needed
                if (!data.error && !data.is_live && !data.last_stream_start_time) {
                    fetchLastStreamTime(username, signal).then(time => {
                        if (time && !signal.aborted) {
                            setStreamers(prev => prev.map(s => 
                                s.username === username ? { ...s, last_stream_start_time: time } : s
                            ));
                        }
                    }).catch(() => {});
                }
                
                // Minimal delay between requests per worker to prevent rate limiting
                if (!isRetry) await new Promise(resolve => setTimeout(resolve, 150));
                
                // If successful, remove from failed set
                if (!data.error) {
                    failedStreamersRef.current.delete(username);
                }
              }
            }
          };

          // Start workers and wait for ALL of them to finish
          const workers = Array.from({ length: CONCURRENCY }, () => worker());
          await Promise.all(workers);
          
        } catch (error) {
          // Silently handle error
        }

        // Check if all are done
        if (failedStreamersRef.current.size === 0) {
            setLoading(false);
            break; // All done
        }
        
        // Wait before full reload
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }, [fetchStreamerData]);

  const retryStreamer = useCallback(async (username: string) => {
    setStreamers(prev => prev.map(s => 
      s.username === username ? { ...s, isLoading: true, error: false } : s
    ));

    const newData = await fetchStreamerData(username);

    setStreamers(prev => prev.map(s => {
      if (s.username === username) {
        return newData;
      }
      return s;
    }));
  }, [fetchStreamerData]);

  // Initial fetch on mount
  useEffect(() => {
    refreshStreamers();
    
    // Cleanup function to abort requests when leaving the page
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refreshStreamers]);

  return (
    <StreamerContext.Provider value={{ streamers, loading, refreshStreamers, retryStreamer }}>
      {children}
    </StreamerContext.Provider>
  );
};

export const useStreamerContext = () => {
  const context = useContext(StreamerContext);
  if (context === undefined) {
    throw new Error('useStreamerContext must be used within a StreamerProvider');
  }
  return context;
};
