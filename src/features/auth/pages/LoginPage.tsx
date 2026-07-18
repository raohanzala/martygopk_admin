import { Navigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input, Button, Card } from '@/components';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useLogin } from '../hooks/useLogin';

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginPage() {
  const { token } = useAppSelector((state) => state.auth);
  const { loginMutation, isLoggingIn } = useLogin();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Admin Panel
          </h1>

          <img src="../logo.png" alt="Logo" width={100} height={100} />
          <p className="text-sm text-text-muted">
            Sign in to manage your store
          </p>
        </div>

        <Card>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={(values) => loginMutation(values)}
          >
            <Form className="space-y-6">
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="admin@example.com"
                required
              />
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                required
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoggingIn}
              >
                Sign in
              </Button>
            </Form>
          </Formik>
        </Card>

        {/* <p className="text-center text-xs text-text-muted mt-6">
          Default: admin@luxurywatches.com / admin123
        </p> */}
      </div>
    </div>
  );
}
