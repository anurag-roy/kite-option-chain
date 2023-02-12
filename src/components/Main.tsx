import { expiryOptions, groups } from '@/config';
import { ExpiryOption, getKeys } from '@/utils';
import { FormEvent, useState } from 'react';
import { ComboBoxInput } from './ComboBoxInput';
import { Table } from './Table';

const groupDropdownOptions = getKeys(groups);
const expiryDropdownOptions = expiryOptions.map(
  (o) => `${o.monthName} ${o.year}`
);

export function Main() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedStocks, setSubscribedStocks] = useState<string[]>([]);
  const [expiry, setExpiry] = useState<ExpiryOption>();

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubscribed) {
      setSubscribedStocks([]);
    } else {
      const formData = new FormData(event.currentTarget);
      const selectedGroup = formData
        .get('group')
        ?.valueOf() as keyof typeof groups;
      const selectedExpiry = formData.get('expiry')?.valueOf() as string;

      setSubscribedStocks(groups[selectedGroup]);
      setExpiry(
        expiryOptions.find((o) => {
          const [month, year] = selectedExpiry.split(' ');
          return o.monthName === month && o.year.toString() === year;
        })
      );
      setIsSubscribed(true);
    }
  };

  return (
    <main>
      <form
        className="max-w-5xl mx-auto mt-6 rounded-lg py-6 bg-gray-100 flex items-end justify-between px-4 sm:px-6 lg:px-8 [&>*:first-child]:grow"
        onSubmit={handleFormSubmit}
      >
        <ComboBoxInput name="group" items={groupDropdownOptions} />
        <ComboBoxInput name="expiry" items={expiryDropdownOptions} />
        <button
          type="submit"
          className="px-4 py-2 text-base font-medium rounded-full text-white animated-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {subscribedStocks.map((s) => (
          <Table
            key={s}
            name={s}
            expiry={`${expiry?.year}-${expiry?.monthValue! + 1}`}
          />
        ))}
      </div>
    </main>
  );
}
