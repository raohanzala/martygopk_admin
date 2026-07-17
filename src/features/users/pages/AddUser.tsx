import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { useAddUser } from '../hooks/useAddUser';
import type { UserFormValues } from '../types/user.types';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { addUserMutation, isAddingUser } = useAddUser();

  const handleSubmit = (values: UserFormValues) => {
    addUserMutation(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      },
      {
        onSuccess: () => {
          navigate('/users');
        },
      }
    );
  };

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
          Add user
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Create a new user account
        </p>
      </div>

      <UserForm
        onSubmit={handleSubmit}
        isSubmitting={isAddingUser}
      />
    </div>
  );
};

export default AddUser;
