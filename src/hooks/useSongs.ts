import { getSongs } from '@/services/songs';
import { useQuery } from '@tanstack/react-query';

const useSongs = () => {
  const { data: songs, isLoading: songsLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  return { songs, songsLoading };
};

export default useSongs;
