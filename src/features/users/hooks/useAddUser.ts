import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addUserApi, type CreateUserPayload } from '@/api/users';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useAddUser() {
  const queryClient = useQueryClient();

  const { mutate: addUserMutation, isPending: isAddingUser } = useMutation({
    mutationFn: (data: CreateUserPayload) => addUserApi(data),
    onSuccess: (data) => {
      toastSuccess(data.message || 'User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => toastError(err),
  });

  return { addUserMutation, isAddingUser };
}
