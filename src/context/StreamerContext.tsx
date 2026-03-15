import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Channel } from '../types';
import { fetchKickChannel } from '../services/kickService';
import { streamersList } from '../data/streamers';

interface StreamerContextType {
  streamers: Channel[];
  loading: boolean;
  refreshStreamers: (force?: boolean) => Promise<void>;
  retryStreamer: (username: string) => Promise<void>;
}

const StreamerContext = createContext<StreamerContextType | undefined>(undefined);

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

export const StreamerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streamers, setStreamers] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  
  const hasInitialLoaded = useRef(false);
  const isFetchingRef = useRef(false);

  const fetchStreamerData = useCallback(async (username: string) => {
    try {
      return await fetchKickChannel(username);
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

  const refreshStreamers = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && hasInitialLoaded.current && now - lastUpdated < CACHE_DURATION) {
      return;
    }

    if (isFetchingRef.current) {
      return; // Prevent overlapping fetch loops
    }

    isFetchingRef.current = true;
    setLoading(true);
    
    // Initial load with skeletons if empty
    if (!hasInitialLoaded.current) {
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
      hasInitialLoaded.current = true;
    }

    try {
      // Fetch all data in the background first, then update UI all at once
      const queue = [...streamersList];
      const CONCURRENCY = 8; // High concurrency for maximum speed
      const fetchedData = new Map<string, Channel>();
      
      const worker = async () => {
        while (queue.length > 0) {
          const username = queue.shift();
          if (username) {
            const data = await fetchStreamerData(username);
            fetchedData.set(username, data);
            
            // Minimal delay to prevent browser socket exhaustion
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      };

      // Start workers and wait for ALL of them to finish
      const workers = Array.from({ length: CONCURRENCY }, () => worker());
      await Promise.all(workers);
      
      // Update state ALL AT ONCE after everything is fetched
      setStreamers(prev => {
        return prev.map(oldChannel => {
          const newData = fetchedData.get(oldChannel.username);
          if (!newData) return oldChannel;
          
          // If we already have valid data and the new fetch failed, KEEP the old data
          if (!oldChannel.error && !oldChannel.isLoading && newData.error) {
            return oldChannel;
          }
          return newData;
        });
      });
      
      setLastUpdated(Date.now());
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [lastUpdated, fetchStreamerData]);

  const retryStreamer = useCallback(async (username: string) => {
    setStreamers(prev => prev.map(s => 
      s.username === username ? { ...s, isLoading: true, error: false } : s
    ));

    const newData = await fetchStreamerData(username);

    setStreamers(prev => prev.map(s => {
      if (s.username === username) {
        // If we had valid data previously, don't overwrite with error
        if (!s.error && !s.isLoading && newData.error) {
          return s;
        }
        return newData;
      }
      return s;
    }));
  }, [fetchStreamerData]);

  // Initial fetch
  useEffect(() => {
    refreshStreamers();
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
