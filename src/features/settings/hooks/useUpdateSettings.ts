import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateSettingsApi,
  type UpdateSettingsInput,
} from '@/api/settings';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  const { mutate: updateSettingsMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (data: UpdateSettingsInput) => updateSettingsApi(data),
      onSuccess: (data) => {
        toastSuccess(data.message || 'Settings updated successfully');
        queryClient.invalidateQueries({ queryKey: ['settings'] });
      },
      onError: (err) => toastError(err),
    });

  return { updateSettingsMutation, isUpdating };
}
