import { useStreamerContext } from '../context/StreamerContext';

export const useStreamerData = () => {
  const { streamers, loading, retryStreamer } = useStreamerContext();
  return { streamers, loading, retryStreamer };
};
