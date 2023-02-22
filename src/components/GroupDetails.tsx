import { GROUPS } from '@/config';
import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';

interface GroupDetailsProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function GroupDetails({ open, setOpen }: GroupDetailsProps) {
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
            <div className="relative inline-block align-middle bg-white dark:bg-zinc-900 rounded-lg py-4 px-8 text-left overflow-hidden shadow-xl transform transition-all my-8">
              <Dialog.Title
                as="h3"
                className="text-center leading-6 font-semibold text-zinc-800 dark:text-zinc-200 mb-6"
              >
                Group Details
              </Dialog.Title>
              <div className="grid grid-cols-2 gap-8">
                {Object.entries(GROUPS).map(([key, values]) => (
                  <div
                    key={key}
                    className="px-4 pt-3 pb-6 rounded-xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700"
                  >
                    <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-6">
                      {key}
                    </h4>
                    <ul className="flex flex-wrap gap-4">
                      {values.map((v) => (
                        <li
                          key={v}
                          className="px-2.5 py-0.5 rounded-full text-sm font-semibold leading-6 border border-blue-500/20 bg-blue-50/50 p-4 text-blue-900 dark:bg-blue-500/5 dark:text-blue-200"
                        >
                          {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-6 mx-auto flex justify-center rounded-full border border-transparent shadow-sm px-6 py-2 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                onClick={() => setOpen(false)}
              >
                Got it!
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
