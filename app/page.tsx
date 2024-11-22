'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { EmailForm } from '@/components/email-form';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (session) {
      const redirectTo = searchParams.get('redirectedFrom') || '/dashboard';
      router.push(redirectTo);
    }
  }, [session, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <Mail className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">Email Service</h1>
        </motion.div>

        {!session ? (
          <>
            <div className="mt-8 text-center">
              <p className="text-xl text-muted-foreground mb-6">
                Sign in to start sending emails and access your dashboard
              </p>
              <Button 
                onClick={() => router.push('/auth')} 
                size="lg"
                className="min-w-[200px]"
              >
                Sign In
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-8">
            <EmailForm />
          </div>
        )}
      </motion.div>
    </main>
  );
}