export function isPlaceholderKey(value: string | undefined): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return lower.includes('placeholder');
}

export function isClerkEnabled(): boolean {
  const pub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const sec = process.env.CLERK_SECRET_KEY;
  if (!pub || !sec) return false;
  return !isPlaceholderKey(pub) && !isPlaceholderKey(sec);
}

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)
  );
}

