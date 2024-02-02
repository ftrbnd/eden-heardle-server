import { getSongs } from '@/lib/songsApi';
import { useQuery } from '@tanstack/react-query';

const useSongs = () => {
  const { data: songs, isLoading: songsLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs
  });

  return { songs, songsLoading };
};

export default useSongs;
