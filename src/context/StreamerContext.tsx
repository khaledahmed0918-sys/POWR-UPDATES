import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Channel } from '../types';

interface StreamerContextType {
  streamers: Channel[];
  loading: boolean;
  liveDInitiated: boolean;
  refreshStreamers: () => Promise<void>;
  retryStreamer: (username: string) => Promise<void>;
}

const StreamerContext = createContext<StreamerContextType | undefined>(undefined);

export const StreamerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streamers, setStreamers] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveDInitiated, setLiveDInitiated] = useState(false);
  
  const refreshStreamers = useCallback(async () => {
    setLiveDInitiated(true);
    try {
      const response = await fetch('https://dolabriform-fascinatedly-lecia.ngrok-free.dev/liveD', {
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      });
      const data = await response.json();
      
      const channelArray: Channel[] = Object.values(data).map((s: any) => ({
        ...s,
        error: false,
        isLoading: false,
      }));
      
      setStreamers(channelArray);
    } catch (error) {
      console.error("Failed to fetch streamers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const retryStreamer = useCallback(async (username: string) => {
    await refreshStreamers();
  }, [refreshStreamers]);

  useEffect(() => {
    refreshStreamers();
    const interval = setInterval(refreshStreamers, 50000);
    return () => clearInterval(interval);
  }, [refreshStreamers]);

  return (
    <StreamerContext.Provider value={{ streamers, loading, liveDInitiated, refreshStreamers, retryStreamer }}>
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
