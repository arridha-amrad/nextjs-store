import LoginForm from '@/components/forms/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Start using your account',
};

export default function Page() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
