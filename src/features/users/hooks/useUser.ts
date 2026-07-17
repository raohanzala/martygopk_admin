import { useQuery } from '@tanstack/react-query';
import { getUserByIdApi } from '@/api/users';

export function useUser(id: string | undefined) {
  const {
    isPending: isUserLoading,
    error: userError,
    data,
  } = useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserByIdApi(id!),
    enabled: !!id,
  });

  const user = data?.user;
  return { user, isUserLoading, userError };
}
