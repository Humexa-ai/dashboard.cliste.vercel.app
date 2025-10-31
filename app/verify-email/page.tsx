"use client";

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!isLoaded) {
      return;
    }

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200/80 bg-white/80 p-8 shadow-2xl backdrop-blur-xl backdrop-saturate-150 dark:border-neutral-800/50 dark:bg-neutral-950/80">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
            Verify your email
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            We sent a verification code to your email address
          </p>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Verification code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 text-center text-lg tracking-widest text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-neutral-100 dark:focus:bg-neutral-900 dark:focus:ring-neutral-100/20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!isLoaded}
              className="w-full"
              variant="default"
              size="lg"
            >
              Verify Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

