import { groups } from '@/config';
import { getExpiryOptions, getKeys } from '@/utils';
import { FormEvent, useState } from 'react';
import { ComboBoxInput } from './ComboBoxInput';
import { Table } from './Table';

const groupDropdownOptions = getKeys(groups);
const expiryOptions = getExpiryOptions();

export function Main() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedStocks, setSubscribedStocks] = useState<string[]>([]);
  const [expiry, setExpiry] = useState<string>('');

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubscribed) {
      setSubscribedStocks([]);
      setIsSubscribed(false);
    } else {
      const formData = new FormData(event.currentTarget);
      const selectedGroup = formData
        .get('group')
        ?.valueOf() as keyof typeof groups;
      const selectedExpiry = formData.get('expiry')?.valueOf() as string;

      setIsSubscribed(true);
      setExpiry(selectedExpiry);
      setSubscribedStocks(groups[selectedGroup]);
    }
  };

  return (
    <main>
      <form
        className="max-w-5xl mx-auto mt-6 rounded-lg py-6 bg-gray-100 flex items-end justify-between px-4 sm:px-6 lg:px-8 [&>*:first-child]:grow"
        onSubmit={handleFormSubmit}
      >
        <ComboBoxInput name="group" items={groupDropdownOptions} />
        <ComboBoxInput name="expiry" items={expiryOptions} />
        <button
          type="submit"
          className="px-4 py-2 text-base font-medium rounded-full text-white animated-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {subscribedStocks.map((s) => (
          <Table key={s} name={s} expiry={expiry} />
        ))}
      </div>
    </main>
  );
}
