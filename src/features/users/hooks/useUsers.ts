import { useQuery } from '@tanstack/react-query';
import { getUsersApi, type UserParams } from '@/api/users';

export function useUsers(params?: UserParams) {
  const {
    data,
    isPending: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['users', params?.search, params?.role],
    queryFn: () => getUsersApi(params),
  });

  const { users = [], total = 0 } = data || {};
  return { users, total, isUsersLoading, usersError };
}
