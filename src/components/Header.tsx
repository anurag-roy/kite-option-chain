import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { NseLogo } from './NseLogo';

type HeaderProps = {
  status: 'authorized' | 'unauthorized';
  data: string;
};

export function Header({ status, data }: HeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto flex items-center gap-2">
      <NseLogo />
      <h1 className="text-2xl font-bold text-zinc-900 mr-auto">Option Chain</h1>
      {status === 'authorized' ? (
        <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100">
          <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Logged in ({data})
        </span>
      ) : (
        <a
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          href={data}
        >
          <XCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Session expired. Click here to login
        </a>
      )}
    </header>
  );
}
