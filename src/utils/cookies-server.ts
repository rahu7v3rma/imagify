import { cookies } from 'next/headers';

export const getAccessTokenServer = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('imagify.access-token')?.value;
};
