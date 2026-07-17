import apiClient from './axios';

export interface UserParams {
  search?: string;
  role?: 'user' | 'admin';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  provider?: 'credentials' | 'google';
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

export const getUsersApi = async (params?: UserParams) => {
  const response = await apiClient.get<UsersResponse>('/users', {
    params: params
      ? {
          search: params.search || undefined,
          role: params.role || undefined,
        }
      : undefined,
  });
  return response.data;
};

export const getUserByIdApi = async (id: string) => {
  const response = await apiClient.get<{ user: User }>(`/users/${id}`);
  return response.data;
};

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  password?: string;
}

export const addUserApi = async (data: CreateUserPayload) => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

export const updateUserApi = async (id: string, data: UpdateUserPayload) => {
  const response = await apiClient.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteUserApi = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
