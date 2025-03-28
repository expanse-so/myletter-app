'use client';

import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 bg-primary rounded-br-2xl rounded-tr-sm rounded-tl-2xl rounded-bl-sm" />
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}