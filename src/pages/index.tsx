import { Header } from '@/components/Header';
import { Main } from '@/components/Main';
import { kc, kt } from '@/globals';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Connect KiteTicker
  kt.connect();

  // getProfile call to check if logged in or not
  try {
    const profile = await kc.getProfile();
    return {
      props: {
        status: 'authorized' as const,
        data: profile.user_id || '',
      },
    };
  } catch (error) {
    console.log('Access token expired or not set.');
    const loginUrl = kc.getLoginURL();
    return {
      props: {
        status: 'unauthorized' as const,
        data: loginUrl,
      },
    };
  }
}

type HomeProps = {
  status: 'authorized' | 'unauthorized';
  data: string;
};

export default function Home({ status, data }: HomeProps) {
  return (
    <>
      <Head>
        <title>Kite Option Chain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header status={status} data={data} />
      <Main />
    </>
  );
}
