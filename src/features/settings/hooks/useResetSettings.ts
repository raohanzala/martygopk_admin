import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetSettingsApi } from '@/api/settings';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useResetSettings() {
  const queryClient = useQueryClient();

  const { mutate: resetSettingsMutation, isPending: isResetting } =
    useMutation({
      mutationFn: resetSettingsApi,
      onSuccess: (data) => {
        toastSuccess(data.message || 'Settings reset successfully');
        queryClient.invalidateQueries({ queryKey: ['settings'] });
      },
      onError: (err) => toastError(err),
    });

  return { resetSettingsMutation, isResetting };
}
