import { SocketData, UiInstrument } from '@/types/SocketData';
import { memo, useEffect, useState } from 'react';

type TableProps = {
  name: string;
  expiry: string;
};

export const Table = memo(({ name, expiry }: TableProps) => {
  const [ltp, setLtp] = useState(0);
  const [instruments, setInstruments] = useState<UiInstrument[]>([]);

  useEffect(() => {
    if (name && expiry) {
      console.log('Connecting websocket');
      const ws = new WebSocket(
        `ws://localhost:8000/api/wss?name=${name}&expiry=${expiry}`
      );

      ws.onopen = () => {
        console.log('Connected!');
      };

      ws.onmessage = (event) => {
        const { action, data } = JSON.parse(event.data) as SocketData;
        if (action === 'init') {
          setLtp(data.ltp);
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
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="text-sm font-semibold">{ltp}</p>
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
                    (i.strike <= 0.9 * ltp && i.instrument_type === 'PE') ||
                    (i.strike >= 1.1 * ltp && i.instrument_type === 'CE')
                  );
                })
                .map((i) => (
                  <tr
                    key={i.instrument_token}
                    className="divide-x divide-gray-200"
                  >
                    <td className="-px-4 font-normal text-gray-500">
                      {i.strike} {i.instrument_type}
                    </td>
                    <td>{i.bid ?? '-'}</td>
                    <td>{i.ask ?? '-'}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
