import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

type HeaderProps = {
  status: 'authorized' | 'unauthorized';
  data: string;
};

const nseLogo = (
  <svg
    width="36"
    height="36"
    viewBox="0 0 204 204"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M102.1 146.6L57.3 101.9L102.1 57.2L146.9 101.9L102.1 146.6Z"
      fill="#FEFEFE"
    />
    <path
      d="M174.4 29.8L102.4 0.600006L30.1 30.1L102.1 57.2L174.4 29.8Z"
      fill="#E65C1B"
    />
    <path d="M146.9 101.9L174.4 29.8L102.1 57.2L146.9 101.9Z" fill="#362D7E" />
    <path
      d="M102.1 146.6L174.4 173.7L146.9 101.9L102.1 146.6Z"
      fill="#ECAE0E"
    />
    <path d="M102.1 57.2L30.1 30.1L57.3 101.9L102.1 57.2Z" fill="#ECAE0E" />
    <path
      d="M30.1 30.1C29.7 29.7 0.5 101.9 0.5 101.9L30.1 173.7L57.3 101.9L30.1 30.1Z"
      fill="#E31D25"
    />
    <path d="M57.3 101.9L30.1 173.7L102.1 146.6L57.3 101.9Z" fill="#ECAE0E" />
    <path
      d="M30.1 173.7L102.1 203.2L174.4 173.7L102.1 146.6L30.1 173.7Z"
      fill="#E31D25"
    />
    <path
      d="M174.4 29.8L146.9 101.9L174.4 173.7L204 101.9L174.4 29.8Z"
      fill="#E65C1B"
    />
  </svg>
);

export function Header({ status, data }: HeaderProps) {
  return (
    <header className="flex items-center gap-2">
      {nseLogo}
      <h1 className="text-2xl font-bold text-gray-800 mr-auto">Option Chain</h1>
      {status === 'authorized' ? (
        <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100">
          <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Logged in via {data}
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
