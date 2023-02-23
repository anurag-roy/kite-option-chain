import { UiInstrument } from '@/types/SocketData';
import { getMonthName } from '@/utils/ui';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';

interface OrderModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  i: UiInstrument;
  price: number;
}

export function OrderModal({ open, setOpen, i, price }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [requiredMargin, setRequiredMargin] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      const params = new URLSearchParams();
      params.append('price', price.toString());
      params.append('quantity', (quantity * i.lot_size).toString());
      params.append('tradingsymbol', i.tradingsymbol);
      fetch('/api/getMargin?' + params.toString())
        .then((res) => res.json())
        .then((margin) => setRequiredMargin(margin.total));
    }
  }, [quantity, open]);

  const placeSellOrder = () => {
    const body = {
      price: price,
      quantity: i.lot_size * quantity,
      tradingsymbol: i.tradingsymbol,
    };
    fetch('/api/placeSellOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((_res) => {
        alert('Order placed successfully!');
        setOpen(false);
      })
      .catch((_err) => alert('Error while placing order'));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="block min-h-screen max-w-[80vw] m-auto text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-zinc-500 bg-opacity-75 dark:bg-zinc-800 dark:bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block align-middle h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-0 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-0 scale-95"
          >
            <div className="min-w-[512px] relative inline-block align-middle bg-white dark:bg-zinc-900 rounded-lg p-6 text-left overflow-hidden shadow-xl transform transition-all my-8">
              <Dialog.Title
                as="div"
                className="flex flex-row justify-between items-center mb-12"
              >
                <h3 className="px-3 py-1 rounded-full text-lg font-semibold leading-6 border border-blue-500/20 bg-blue-50/50 p-4 text-blue-900 dark:bg-blue-500/5 dark:text-blue-200">
                  {i.name} {i.strike} {i.instrument_type}{' '}
                  {getMonthName(i.expiry)}
                </h3>
                <button
                  type="button"
                  className="bg-white dark:bg-zinc-900 rounded-md text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </Dialog.Title>
              <div className="max-w-sm mx-auto grid grid-cols-2 gap-6 mb-12">
                <div className="p-4 rounded-md text-emerald-800 bg-emerald-50/50 ring-1 ring-inset ring-emerald-700/20 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200">
                  <h4 className="font-semibold text-sm text-emerald-700">
                    Price
                  </h4>
                  <p className="font-bold text-2xl">₹ {price}</p>
                </div>
                <div className="p-4 rounded-md text-red-800 bg-red-50/50 ring-1 ring-inset ring-red-700/20 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-200">
                  <h4 className="font-semibold text-sm text-red-700">Margin</h4>
                  <p className="font-bold text-2xl">
                    ₹ {requiredMargin ?? '-'}
                  </p>
                </div>
              </div>
              <div className="mx-auto grid grid-cols-[repeat(5,_auto)] place-items-center gap-x-4 gap-y-2 mb-16">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Lot Size
                </span>
                <span></span>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Quantity
                </label>
                <span></span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Total
                </span>
                <span className="px-5 py-2 bg-zinc-100 dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-md">
                  {i.lot_size}
                </span>
                <span className="text-sm font-medium text-zinc-500">×</span>
                <input
                  type="number"
                  name="quantity"
                  className="w-36 dark:bg-zinc-800 shadow-sm focus:ring-blue-500 focus:border-blue-500 font-semibold text-center text-zinc-800 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 rounded-md"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={1}
                />
                <span className="text-sm font-medium text-zinc-500">=</span>
                <span className="px-5 py-2 bg-zinc-100 dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-md">
                  {i.lot_size * quantity}
                </span>
              </div>
              <div className="flex flex-row-reverse gap-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2.5 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-3 w-auto"
                  onClick={placeSellOrder}
                >
                  Place Sell Order
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-full border border-zinc-300 dark:border-zinc-700 shadow-sm px-6 py-2.5 bg-white dark:bg-zinc-800 dark:text-zinc-400 font-medium text-zinc-700 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-0 w-auto"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
