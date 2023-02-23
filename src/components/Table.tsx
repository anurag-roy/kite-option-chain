import { DIFF_PERCENT } from '@/config';
import { SocketData, UiInstrument } from '@/types/SocketData';
import { classNames } from '@/utils/ui';
import { memo, useEffect, useState } from 'react';
import { OrderModal } from './OrderModal';

type TableRowProps = {
  i: UiInstrument;
};

const TableRow = ({ i }: TableRowProps) => {
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
      {isOrderModalOpen && (
        <OrderModal
          open={isOrderModalOpen}
          setOpen={setIsOrderModalOpen}
          i={i}
          price={i.bid}
        />
      )}
    </tr>
  );
};

type TableProps = {
  name: string;
  expiry: string;
};

export const Table = memo(({ name, expiry }: TableProps) => {
  const [ltp, setLtp] = useState(0);
  const [previousClose, setPreviousClose] = useState(0);
  const [instruments, setInstruments] = useState<UiInstrument[]>([]);

  const filteredInstruments = instruments?.filter((i) => {
    if (!ltp) return true;
    return (
      (i.strike <= ((100 - DIFF_PERCENT) * ltp) / 100 &&
        i.instrument_type === 'PE') ||
      (i.strike >= ((100 + DIFF_PERCENT) * ltp) / 100 &&
        i.instrument_type === 'CE')
    );
  });

  const diff = ltp - previousClose;

  useEffect(() => {
    if (name && expiry) {
      console.log('Connecting websocket');

      const ws = new WebSocket(
        `ws://localhost:8000/api/wss?name=${encodeURIComponent(
          name
        )}&expiry=${encodeURIComponent(expiry)}`
      );

      ws.onopen = () => {
        console.log('Connected!');
      };

      ws.onmessage = (event) => {
        const { action, data } = JSON.parse(event.data) as SocketData;
        if (action === 'init') {
          setLtp(data.ltp);
          setPreviousClose(data.previousClose);
          setInstruments(data.options);
        } else if (action === 'option-update') {
          setInstruments((instruments) =>
            instruments.map((i) => {
              if (i.instrument_token === data.token) {
                return {
                  ...i,
                  bid: data.bid,
                  ask: data.ask,
                };
              } else {
                return i;
              }
            })
          );
        } else if (action === 'ltp-update') {
          setLtp(data.ltp);
        }
      };
      //clean up function
      return () => ws.close();
    }
  }, []);

  return (
    <div>
      <div className="p-2 flex items-baseline gap-4 text-zinc-900 dark:text-zinc-200">
        <h3 className="text-xl font-bold">{name}</h3>
        <span className="font-semibold">{ltp}</span>
        <span
          className={classNames(
            'text-sm font-semibold',
            diff < 0 ? 'text-red-600' : 'text-green-600'
          )}
        >
          {diff < 0 ? '↓ ' : '↑ '}
          {Math.abs(diff).toFixed(2)}
        </span>
        <p className="text-sm font-semibold"></p>
      </div>
      <div className="resize-y max-h-[50vh] bg-white dark:bg-zinc-900 overflow-y-auto ring-1 ring-zinc-200 dark:ring-zinc-700 rounded-lg">
        <table className="min-w-full divide-y divide-zinc-300 dark:divide-white/10">
          <thead className="bg-zinc-50 dark:bg-zinc-800 sticky top-0">
            <tr className="divide-x divide-zinc-200 dark:divide-white/10">
              <th scope="col">Strike</th>
              <th scope="col" className="min-w-[5ch]">
                Bid
              </th>
              <th scope="col" className="min-w-[5ch]">
                Ask
              </th>
              <th scope="col" className="min-w-[5ch]">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="text-zinc-900 dark:text-zinc-100 divide-y divide-zinc-200 dark:divide-white/10 bg-white dark:bg-zinc-900 overflow-y-auto">
            {filteredInstruments?.length === 0 ? (
              <tr>
                <td colSpan={4}>No data to display.</td>
              </tr>
            ) : (
              filteredInstruments.map((i) => (
                <TableRow key={i.instrument_token} i={i} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
