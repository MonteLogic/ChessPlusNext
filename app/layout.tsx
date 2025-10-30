import '#/styles/globals.css';
import Byline from '#/ui/byline';
import { GlobalNav } from '#/ui/global-nav';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';
import { Analytics } from '@vercel/analytics/next';
import titles from '#/titles.json';
import { getAppUrl, isClerkEnabled } from '#/utils/context/env';

export const metadata: Metadata = {
  title: {
    default: titles.title,
    template: '%s | MonteLogic',
  },
  description:
    titles.title +
    ' is an online system for managing contractors concerns. These concerns include scheduling, timecards, route management and time management. This easy to use app will make truck drivers and route managers working lives much easier.',
  openGraph: {
    title: titles.title,
    description:
      'Contractor Bud is an online system for managing contractors concerns. These concerns include scheduling, timecards, route management and time management. This easy to use app will make truck drivers and route managers working lives much easier.',
    images: [`/api/og?title=Next.js App Router`],
  },
  twitter: {
    card: 'summary_large_image',
  },
  manifest: '/manifest.json',
  metadataBase: new URL(getAppUrl()),
};

const getUserData = cache(async () => {
  if (!isClerkEnabled()) {
    return {
      title: 'No user logged in',
      description: 'This description comes from the server',
      userID: '',
      dbUserId: null,
    };
  }

  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    return {
      title: 'No user logged in',
      description: 'This description comes from the server',
      userID: '',
      dbUserId: null,
    };
  }
  return {
    title: 'User logged in',
    description: 'This description comes from the server',
    userID: clerkUserId,
    dbUserId: null,
  };
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUserData();
  const clerkEnabled = isClerkEnabled();

  const AppShell = (
    <html lang="en" className="[color-scheme:dark] dark">
      <body className="bg-gray-1100 bg-[url('/grid.svg')]">
        <GlobalNav userData={userData} />
        <div className="lg:pl-64 xl:pl-72">
          <div className="space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            {/* Address bar removed globally */}
            <div className="bg-vc-border-gradient rounded-lg p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black p-3.5 lg:p-6">
                {children}
                <Analytics />
              </div>
            </div>
            <Byline className="fixed sm:hidden" />
          </div>
        </div>
      </body>
    </html>
  );

  // Wrap with ClerkProvider only when real keys are present
  return clerkEnabled ? <ClerkProvider>{AppShell}</ClerkProvider> : AppShell;
}
