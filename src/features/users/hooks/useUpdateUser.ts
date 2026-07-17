import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserApi, type UpdateUserPayload } from '@/api/users';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUserMutation, isPending: isUpdatingUser } =
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
        updateUserApi(id, data),
      onSuccess: (data) => {
        toastSuccess(data.message || 'User updated successfully');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (err) => toastError(err),
    });

  return { updateUserMutation, isUpdatingUser };
}
