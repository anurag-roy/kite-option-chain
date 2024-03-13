import { UiInstrument } from '@/types/SocketData';
import { classNames } from '@/utils/ui';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { OrderModal } from './OrderModal';

type TableRowProps = {
  i: UiInstrument;
};

export const TableRow = ({ i }: TableRowProps) => {
  const adjustedBid = Math.max(0, Number((i.bid - 0.05).toFixed(2)));
  const value = Number((adjustedBid * i.lot_size).toFixed(2));

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <tr className="divide-x divide-zinc-200 dark:divide-white/10">
      <td
        className={classNames(
          '-px-4 font-medium',
          i.instrument_type === 'CE'
            ? 'bg-yellow-50/50 text-yellow-800 dark:bg-stone-700/10 dark:text-yellow-400'
            : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
        )}
      >
        {i.strike} {i.instrument_type}
      </td>
      <td
        className={classNames(
          'bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500',
          adjustedBid > 0
            ? 'cursor-pointer hover:bg-blue-100 hover:dark:bg-blue-900/50'
            : 'pointer-events-none'
        )}
        onClick={() => setIsOrderModalOpen(true)}
      >
        {i.bid ?? '-'}
      </td>
      <td className="bg-red-50/60 text-red-800 dark:bg-red-900/5 dark:text-red-500">
        {i.ask ?? '-'}
      </td>
      <td
        className={classNames(
          value > 0
            ? 'bg-emerald-50/60 text-emerald-800 dark:bg-emerald-900/5 dark:text-emerald-500'
            : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
        )}
      >
        {value}
      </td>
      {isOrderModalOpen &&
        createPortal(
          <OrderModal
            open={isOrderModalOpen}
            setOpen={setIsOrderModalOpen}
            i={i}
            price={i.bid}
          />,
          document.body
        )}
    </tr>
  );
};