import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import useLocalUser from './useLocalUser';
import { getStats } from '@/services/users';

const useStatistics = () => {
  const { data: session } = useSession();
  const localUser = useLocalUser();

  const { data: sessionStatistics, isFetching } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats(session?.user.id),
    enabled: session !== null,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  return { stats: session ? sessionStatistics : localUser?.statistics, loadingStats: isFetching };
};

export default useStatistics;
