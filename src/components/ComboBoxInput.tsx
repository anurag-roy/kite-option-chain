import { classNames } from '@/utils/ui';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import startCase from 'lodash.startcase';
import { Dispatch, SetStateAction, useState } from 'react';

type ComboBoxProps = {
  name: string;
  items: string[];
  selectedItem?: string;
  setSelectedItem?: Dispatch<SetStateAction<string>>;
};

export function ComboBoxInput({
  name,
  items,
  selectedItem,
  setSelectedItem,
}: ComboBoxProps) {
  const [query, setQuery] = useState('');
  const filteredStocks =
    query === ''
      ? items
      : items.filter((i) => i.toLowerCase().includes(query.toLowerCase()));
  return (
    <Combobox
      as="div"
      defaultValue={items[0]}
      value={selectedItem ? selectedItem : undefined}
      onChange={setSelectedItem ? setSelectedItem : undefined}
      className="max-w-sm"
    >
      <Combobox.Label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {startCase(name)}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          name={name}
          className="w-full rounded-md border border-zinc-300 bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDownIcon
            className="h-5 w-5 text-zinc-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredStocks.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white/10 focus:outline-none sm:text-sm">
            {filteredStocks.map((s) => (
              <Combobox.Option
                key={s}
                value={s}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-900 dark:text-zinc-100'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        'block truncate',
                        selected && 'font-semibold'
                      )}
                    >
                      {s}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-blue-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
