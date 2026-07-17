import toast from 'react-hot-toast';

export const toastSuccess = (message: string) => {
  toast.success(message);
};

export const toastError = (error: any) => {
  const message = error?.response?.data?.message || error?.message || 'An error occurred';
  toast.error(message);
};
