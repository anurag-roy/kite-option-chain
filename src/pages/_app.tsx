import '@/globals.css';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';

const inter = Inter({
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-inter: ${inter.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
