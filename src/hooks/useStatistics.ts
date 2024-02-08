import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import useLocalUser from './useLocalUser';
import { getStats } from '@/services/users';

const useStatistics = () => {
  const { data: session, status: sessionStatus } = useSession();
  const localUser = useLocalUser();

  const { data: sessionStatistics, isInitialLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats(session?.user.id),
    enabled: session?.user.id !== null && session?.user.id !== undefined,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  return { stats: session ? sessionStatistics : localUser?.statistics, loadingStats: sessionStatus === 'loading' || isInitialLoading };
};

export default useStatistics;
