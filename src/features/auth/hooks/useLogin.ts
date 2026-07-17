import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setCredentials } from '@/store/slices/authSlice';
import { loginApi } from '@/api/auth';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useLogin() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate: loginMutation, isPending: isLoggingIn } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      dispatch(
        setCredentials(data)
      );
      toastSuccess(data.message || 'Login successful');
      navigate('/');
    },
    onError: (err) => toastError(err),
  });

  return { loginMutation, isLoggingIn };
}
