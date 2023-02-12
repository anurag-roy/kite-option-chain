import env from '@/env.json';
import { kc } from '@/globals/kc';
import { writeFileSync } from 'fs';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const requestToken = context.query.request_token as string | undefined;

  if (!requestToken) {
    return {
      props: {
        status: 'error' as const,
        message: 'No request token found. Login not successful.',
      },
    };
  }

  try {
    const { access_token } = await kc.generateSession(
      requestToken,
      env.API_SECRET
    );
    writeFileSync('src/data/accessToken.txt', access_token, 'utf-8');
    return {
      props: {
        status: 'success' as const,
        message: 'Login successful!',
      },
    };
  } catch (error) {
    console.log('Error while generating session', error);
    return {
      props: {
        status: 'error' as const,
        message: 'Authorization failure. Login not successful.',
      },
    };
  }
}

type LoginProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];

export default function Login({ status, message }: LoginProps) {
  return status === 'error' ? (
    <p>{message}</p>
  ) : (
    <>
      <p>{message}</p>
      <p>
        Go to <a href="/">Home</a>
      </p>
    </>
  );
}
