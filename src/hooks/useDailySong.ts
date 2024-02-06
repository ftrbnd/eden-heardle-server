import { getDailySong } from '@/services/songs';
import { useQuery } from '@tanstack/react-query';

const useDailySong = () => {
  const { data: dailySong, isLoading: dailySongLoading } = useQuery({
    queryKey: ['daily'],
    queryFn: getDailySong,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  return { dailySong, dailySongLoading };
};

export default useDailySong;
