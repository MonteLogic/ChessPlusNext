import { cache } from 'react';
import { auth } from '@clerk/nextjs/server';
import { isClerkEnabled } from '#/utils/context/env';

export type UserData = {
  title: string;
  description: string;
  userID: string;
};

export const getUserID = cache(async () => {
  if (!isClerkEnabled()) {
    return {
      title: 'No user logged in',
      description: 'This description comes from the server',
      userID: '',
    };
  }

  const { userId } = auth();
  return {
    title: userId ? `User ID from clerk = ${userId}` : 'No user logged in',
    description: 'This description comes from the server',
    userID: userId ? userId : '',
  };
});
