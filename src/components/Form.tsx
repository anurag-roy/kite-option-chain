import { expiryOptions, groups } from '@/config';
import { getKeys } from '@/utils';
import { FormEvent, useState } from 'react';
import { ComboBoxInput } from './ComboBoxInput';

const groupDropdownOptions = getKeys(groups);
const expiryDropdownOptions = expiryOptions.map(
  (o) => `${o.monthName} ${o.year}`
);

export function Form() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubscribed) {
      // unsubscribe here
    } else {
      const formData = new FormData(event.currentTarget);
      const selectedGroup = formData.get('group');
      const selectedExpiry = formData.get('expiry');

      console.log({ selectedGroup, selectedExpiry });

      setIsSubscribed(true);
    }
  };

  return (
    <>
      <form
        className="flex items-end justify-between px-4 sm:px-6 lg:px-8 [&>*:first-child]:grow"
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
    </>
  );
}
