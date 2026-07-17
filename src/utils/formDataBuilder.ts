export const appendIfExists = (
    formData: FormData,
    key: string,
    value: unknown
  ) => {
    if (value === undefined || value === null || value === '') return;
  
    if (typeof value === 'object' && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  };

  export const appendFiles = (
    formData: FormData,
    key: string,
    files?: File[]
  ) => {
    if (!files?.length) return;
  
    files.forEach(file => {
      formData.append(key, file);
    });
  };