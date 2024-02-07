import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import useLocalUser from './useLocalUser';
import { getStats } from '@/services/users';

const useStatistics = () => {
  const { data: session } = useSession();
  const localUser = useLocalUser();

  const { data: sessionStatistics, isInitialLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => {
      if (!session?.user.id) return;

      return getStats(session?.user.id);
    },
    enabled: session?.user.id !== null,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  return { stats: session?.user ? sessionStatistics : localUser?.statistics, loadingStats: isInitialLoading };
};

export default useStatistics;
