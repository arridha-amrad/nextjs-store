import { Metadata } from 'next';
import LoginForm from '@/components/Forms/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account',
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
