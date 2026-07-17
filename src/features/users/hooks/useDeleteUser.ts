import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserApi } from '@/api/users';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const { mutate: deleteUserMutation, isPending: isDeletingUser } =
    useMutation({
      mutationFn: deleteUserApi,
      onSuccess: (data) => {
        toastSuccess(data.message || 'User deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (err) => toastError(err),
    });

  return { deleteUserMutation, isDeletingUser };
}
