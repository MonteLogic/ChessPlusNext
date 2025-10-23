'use server';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { isClerkEnabled } from '#/utils/context/env';
export default async function Page() {
  const clerkEnabled = isClerkEnabled();
  return (
    <div className="relative z-0 space-y-10 text-white">
      <div className="space-y-5">
        <div className="text-gray-1800 text-xs font-semibold uppercase tracking-wider">
          <h3>Home Page</h3>
        </div>
      </div>
      {clerkEnabled ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <Link 
          href={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in'}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Sign In
        </Link>
      )}
      <div className="space-y-5">
        <p>This is contractor buddy, sign-in </p>
        <p>Here you will see a summary of your work.</p>
      </div>
    </div>
  );
}
