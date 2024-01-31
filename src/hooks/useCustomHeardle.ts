import { checkUserCustomHeardle, createCustomHeardle, deleteCustomHeardle } from '@/lib/customHeardleApi';
import { Song } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface CreateFn {
  selectedSong: Song;
  startTime: number;
}

const useCustomHeardle = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryFn: () => checkUserCustomHeardle(session?.user.id ?? 'fakeid'),
    queryKey: ['userCustomHeardle', session?.user.id],
    enabled: !!session?.user.id
  });

  const createHeardleMutation = useMutation({
    mutationFn: (variables: CreateFn) => createCustomHeardle(variables.selectedSong, variables.startTime, session?.user.id!),
    onError: (error: any) => {
      throw new Error(error.message);
    },
    onSuccess: (link) => {
      queryClient.invalidateQueries({ queryKey: ['userCustomHeardle', session?.user.id] });
      return link;
    }
  });

  const deleteHeardleMutation = useMutation({
    mutationFn: () => deleteCustomHeardle(data?.id ?? 'fakeheardleid', session?.user.id ?? 'fakeuserid'),
    onError: (error: any) => {
      throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCustomHeardle', session?.user.id] });
    }
  });

  const create = async (selectedSong: Song, startTime: number) => {
    const link = await createHeardleMutation.mutateAsync({ selectedSong, startTime });
    return link;
  };

  const remove = async () => {
    await deleteHeardleMutation.mutateAsync();
  };

  return { data, create, remove, createLoading: createHeardleMutation.isLoading, deleteLoading: deleteHeardleMutation.isLoading };
};

export default useCustomHeardle;
