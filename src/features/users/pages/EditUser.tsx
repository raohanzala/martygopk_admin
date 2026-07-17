import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { Spinner } from '@/components';
import { useUser } from '../hooks/useUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import type { UserFormValues } from '../types/user.types';

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isUserLoading } = useUser(id || '');
  const { updateUserMutation, isUpdatingUser } = useUpdateUser();

  const handleSubmit = (values: UserFormValues) => {
    if (!id) return;

    const data: { name: string; email: string; role: 'user' | 'admin'; password?: string } = {
      name: values.name,
      email: values.email,
      role: values.role,
    };
    if (values.password && values.password.trim()) {
      data.password = values.password;
    }

    updateUserMutation(
      { id, data },
      {
        onSuccess: () => {
          navigate('/users');
        },
      }
    );
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/users')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Users
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">
          Edit user
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Update user information
        </p>
      </div>

      <UserForm
        userToEdit={user}
        onSubmit={handleSubmit}
        isSubmitting={isUpdatingUser}
      />
    </div>
  );
};

export default EditUser;
