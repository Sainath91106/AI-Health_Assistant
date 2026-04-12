import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import { extractErrorMessage } from '../utils/helpers';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register(form);
      toast.success('Registration successful');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = extractErrorMessage(err, 'Unable to register. Please try again.');
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Register to manage prescriptions and chat with your healthcare assistant."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-medicalBlue hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="name"
          label="Full Name"
          value={form.name}
          onChange={updateField('name')}
          placeholder="Enter your full name"
          autoComplete="name"
          required
          disabled={isSubmitting}
        />

        <InputField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={updateField('email')}
          placeholder="you@hospital.com"
          autoComplete="email"
          required
          disabled={isSubmitting}
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={updateField('password')}
          placeholder="Create a secure password"
          autoComplete="new-password"
          required
          disabled={isSubmitting}
        />

        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
