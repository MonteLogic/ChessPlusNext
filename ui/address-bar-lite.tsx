'use client';
import Link from 'next/link';

export function AddressBarLite() {
  return (
    <div className="flex items-center p-3.5 lg:px-5 lg:py-3">
      <Link 
        href={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in'} 
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Sign In
      </Link>
    </div>
  );
}

export default AddressBarLite;

