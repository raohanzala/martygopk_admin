import { Formik, Form } from 'formik';
import { userCreateSchema, userUpdateSchema } from '@/validation';
import { Button, Card, Input, Select } from '@/components';
import type { UserFormValues } from '../types/user.types';
import type { User } from '@/api/users';

interface UserFormProps {
  userToEdit?: User | null;
  onSubmit: (values: UserFormValues) => void;
  isSubmitting: boolean;
}

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

const UserForm: React.FC<UserFormProps> = ({
  userToEdit,
  onSubmit,
  isSubmitting,
}) => {
  const isCreate = !userToEdit;

  const initialValues: UserFormValues = {
    name: userToEdit?.name || '',
    email: userToEdit?.email || '',
    password: '',
    role: userToEdit?.role || 'user',
  };

  const validationSchema = isCreate ? userCreateSchema : userUpdateSchema;

  const handleSubmit = (values: UserFormValues) => {
    if (isCreate) {
      onSubmit(values);
    } else {
      const payload: Omit<UserFormValues, 'password'> & { password?: string } = {
        name: values.name,
        email: values.email,
        role: values.role,
      };
      if (values.password && values.password.trim()) {
        payload.password = values.password;
      }
      onSubmit({ ...payload, password: payload.password ?? '' });
    }
  };

  return (
    <Formik<UserFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-6">
        <Card title="User information">
          <div className="space-y-4 max-w-md">
            <Input
              name="name"
              label="Name"
              placeholder="e.g. John Doe"
              required
            />
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="e.g. john@example.com"
              required
            />
            <Input
              name="password"
              label={isCreate ? 'Password' : 'New password (leave blank to keep current)'}
              type="password"
              placeholder={isCreate ? 'Min 6 characters' : 'Optional'}
              required={isCreate}
            />
            <Select
              name="role"
              label="Role"
              options={ROLE_OPTIONS}
              required
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="submit" isLoading={isSubmitting}>
            {isCreate ? 'Create user' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default UserForm;
