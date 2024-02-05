import useLocalUser from '@/context/LocalUserProvider';
import { getStats } from '@/lib/statsApi';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const useStatistics = () => {
  const { data: session } = useSession();
  const localUser = useLocalUser();

  const { data: sessionStatistics, isFetching } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    enabled: session !== null,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  return { stats: session ? sessionStatistics : localUser?.statistics, loadingStats: isFetching };
};

export default useStatistics;
