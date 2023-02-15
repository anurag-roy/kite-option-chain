import { DIFF_PERCENT } from '@/config';
import { SocketData, UiInstrument } from '@/types/SocketData';
import { classNames } from '@/utils/ui';
import { memo, useEffect, useState } from 'react';

type TableProps = {
  name: string;
  expiry: string;
};

export const Table = memo(({ name, expiry }: TableProps) => {
  const [ltp, setLtp] = useState(0);
  const [previousClose, setPreviousClose] = useState(0);
  const [instruments, setInstruments] = useState<UiInstrument[]>([]);

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
      <div className="p-2 flex items-baseline gap-4">
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
      <div className="max-h-[60vh] overflow-y-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full h-fit divide-y divide-gray-300">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="divide-x divide-gray-200">
              <th scope="col">Strike</th>
              <th scope="col">Bid</th>
              <th scope="col">Ask</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white overflow-y-auto">
            {instruments?.length === 0 ? (
              <tr>
                <td colSpan={3}>No data to display.</td>
              </tr>
            ) : (
              instruments
                ?.filter((i) => {
                  if (!ltp) return true;
                  return (
                    (i.strike <= ((100 - DIFF_PERCENT) * ltp) / 100 &&
                      i.instrument_type === 'PE') ||
                    (i.strike >= ((100 + DIFF_PERCENT) * ltp) / 100 &&
                      i.instrument_type === 'CE')
                  );
                })
                .map((i) => (
                  <tr
                    key={i.instrument_token}
                    className="divide-x divide-gray-200"
                  >
                    <td
                      className={classNames(
                        '-px-4 font-medium text-gray-900',
                        i.instrument_type === 'CE'
                          ? 'bg-yellow-50 text-yellow-800'
                          : ''
                      )}
                    >
                      {i.strike} {i.instrument_type}
                    </td>
                    <td className="bg-blue-50 text-blue-800">{i.bid ?? '-'}</td>
                    <td className="bg-red-50 text-red-800">{i.ask ?? '-'}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
