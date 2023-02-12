import { kc } from '@/globals/kc';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const profile = await kc.getProfile();
    return {
      props: {
        status: 'logged-in' as const,
        data: profile,
      },
    };
  } catch (error) {
    console.log('Access token expired or not set.');
    const loginUrl = kc.getLoginURL();
    return {
      props: {
        status: 'logged-out' as const,
        data: loginUrl,
      },
    };
  }
}

type HomeProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];

export default function Home({ status, data }: HomeProps) {
  return (
    <>
      <Head>
        <title>Kite Option Chain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        {status === 'logged-in' ? (
          <p>Logged in as {data.user_name}</p>
        ) : (
          <p>
            Session expired. Please login <a href={data}>here</a>
          </p>
        )}
      </header>
      <main className="text-blue-600">Kite Option Chain</main>
    </>
  );
}
