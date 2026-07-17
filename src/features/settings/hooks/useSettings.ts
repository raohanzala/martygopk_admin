import { useQuery } from '@tanstack/react-query';
import { getSettingsApi } from '@/api/settings';

export function useSettings() {
  const {
    data,
    isPending: isSettingsLoading,
    error: settingsError,
    refetch,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await getSettingsApi();
      return res.settings;
    },
  });

  const settings = data;
  return { settings, isSettingsLoading, settingsError, refetch };
}
