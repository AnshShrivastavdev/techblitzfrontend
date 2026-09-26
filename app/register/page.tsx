'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?mode=register');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
      REDIRECTING TO DELEGATE REGISTRATION...
    </div>
  );
}
