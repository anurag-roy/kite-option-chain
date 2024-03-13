import { GroupedUiInstrument, UiInstrument } from '@/types/SocketData';
import { classNames } from '@/utils/ui';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { OrderModal } from './OrderModal';

type TableRowOptionsProps = {
  i: GroupedUiInstrument;
  ltp: number;
};

function isBetweenNumbers(ltp: number, i:GroupedUiInstrument): boolean {
  if(i.CE.name==="MIDCPNIFTY"){
    return ltp > i.strike && ltp < (i.strike+12.5) || ltp < i.strike && ltp > (i.strike-12.5);
  }
  if(i.CE.name==="FINNIFTY"){
    return ltp > i.strike && ltp < (i.strike+25) || ltp < i.strike && ltp > (i.strike-25);
  }
  if(i.CE.name==="BANKNIFTY"){
    return ltp > i.strike && ltp < (i.strike+50) || ltp < i.strike && ltp > (i.strike-50);
  }
  if(i.CE.name==="NIFTY"){
    return ltp > i.strike && ltp < (i.strike+25) || ltp < i.strike && ltp > (i.strike-25);
  }
  return false;
}

export const TableRowOptions = ({ i, ltp }: TableRowOptionsProps) => {
  const adjustedCEBid = Math.max(0, Number((i.CE.bid - 0.05).toFixed(2)));
  const ceValue = Number((adjustedCEBid * i.CE.lot_size).toFixed(2));

  const adjustedPEBid = Math.max(0, Number((i.PE.bid - 0.05).toFixed(2)));
  const peValue = Number((adjustedPEBid * i.PE.lot_size).toFixed(2));

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <tr className={classNames('divide-x divide-zinc-200 dark:divide-white/10', isBetweenNumbers(ltp,i)? 'bg-green-200' : '')}>
      {/* <td
        className={classNames(
          peValue > 0
            ? 'bg-emerald-50/60 text-emerald-800 dark:bg-emerald-900/5 dark:text-emerald-500'
            : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
        )}
      >
        {peValue}
      </td> */}
      <td className="bg-red-50/60 text-red-800 dark:bg-red-900/5 dark:text-red-500">
        {i.PE.ask ?? '-'}
      </td>
      <td
        className={classNames(
          'bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500',
          adjustedPEBid > 0
            ? 'cursor-pointer hover:bg-blue-100 hover:dark:bg-blue-900/50'
            : 'pointer-events-none'
        )}
      >
        {i.PE.bid ?? '-'}
      </td>
      <td
        className={classNames(
          '-px-4 font-medium', 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
        )}
      >
        {i.strike}
      </td>
      <td
        className={classNames(
          'bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500',
          adjustedCEBid > 0
            ? 'cursor-pointer hover:bg-blue-100 hover:dark:bg-blue-900/50'
            : 'pointer-events-none'
        )}
      >
        {i.CE.bid ?? '-'}
      </td>
      <td className="bg-red-50/60 text-red-800 dark:bg-red-900/5 dark:text-red-500">
        {i.CE.ask ?? '-'}
      </td>
      {/* <td
        className={classNames(
          ceValue > 0
            ? 'bg-emerald-50/60 text-emerald-800 dark:bg-emerald-900/5 dark:text-emerald-500'
            : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
        )}
      >
        {ceValue}
      </td> */}
    </tr>
  );
};