import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { NseLogo } from './NseLogo';
import { ThemeToggle } from './ThemeToggle';

type HeaderProps = {
  status: 'authorized' | 'unauthorized';
  data: string;
};

export function Header({ status, data }: HeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto flex items-center gap-2">
      <NseLogo />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mr-auto">
        Option Chain
      </h1>
      <ThemeToggle />
      {status === 'authorized' ? (
        <span className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-emerald-800 bg-emerald-50/50 ring-1 ring-inset ring-emerald-700/20 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200">
          <CheckCircleIcon
            className="-ml-1 mr-2 h-5 w-5 fill-emerald-600 dark:fill-emerald-200/50"
            aria-hidden="true"
          />
          Logged in ({data})
        </span>
      ) : (
        <a
          className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-800 bg-red-50/50 ring-1 ring-inset ring-red-700/20 hover:ring-red-700/50 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-200"
          href={data}
        >
          <XCircleIcon
            className="-ml-1 mr-2 h-5 w-5 fill-red-600 dark:fill-red-200/50"
            aria-hidden="true"
          />
          Session expired. Click here to login
        </a>
      )}
    </header>
  );
}
