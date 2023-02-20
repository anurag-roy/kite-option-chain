import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="mx-auto dark:bg-zinc-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
