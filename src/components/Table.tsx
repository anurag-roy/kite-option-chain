import { DIFF_PERCENT } from '@/config';
import { GroupedUiInstrument, SocketData, UiInstrument } from '@/types/SocketData';
import { classNames } from '@/utils/ui';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { OrderModal } from './OrderModal';
import { TableRow } from './TableRow';
import { TableRowOptions } from './TableRowOptions';

type TableRowProps = {
  i: UiInstrument;
};

type TableRowOptionsProps = {
  i: GroupedUiInstrument;
};

type TableProps = {
  name: string;
  expiry: string;
};

export const Table = memo(({ name, expiry }: TableProps) => {
  const [ltp, setLtp] = useState(0);
  const [previousClose, setPreviousClose] = useState(0);
  const [instruments, setInstruments] = useState<UiInstrument[]>([]);
  const [groupedInstruments, setGroupedInstruments] = useState<GroupedUiInstrument[]>([]);
  const [segment, setSegment] = useState("");

  const filteredInstruments = instruments?.filter((i) => {
    if (!ltp) return true;
    return (
      (i.strike >= ((100 - DIFF_PERCENT) * ltp) / 100 &&
        i.instrument_type === 'PE') ||
      (i.strike <= ((100 + DIFF_PERCENT) * ltp) / 100 &&
        i.instrument_type === 'CE')
    );
  });

  const filteredGroupedInstruments = groupedInstruments?.filter((i) => {
    if (!ltp) return true;
    return (
      (i.strike >= ((100 - DIFF_PERCENT) * ltp) / 100 &&
        i.PE.instrument_type === 'PE') ||
      (i.strike <= ((100 + DIFF_PERCENT) * ltp) / 100 &&
        i.CE.instrument_type === 'CE')
    );
  });

  const diff = ltp - previousClose;

  useEffect(() => {
    if (name && expiry) {
      console.log('Connecting websocket');

      const ws = new WebSocket(
        `ws://localhost:9000/api/wss?name=${encodeURIComponent(
          name
        )}&expiry=${encodeURIComponent(expiry)}`
      );

      ws.onopen = () => {
        console.log('Connected!');
      };

      ws.onmessage = (event) => {
        const { action, data } = JSON.parse(event.data) as SocketData;
        console.log("Init data : ", data);
        if (action === 'init') {
          setLtp(data.ltp);
          setPreviousClose(data.previousClose);
          setInstruments(data.options);
          setGroupedInstruments(groupUiInstrumentsByStrike(data.options));
          const groupedInstru = groupUiInstrumentsByStrike(data.options);
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

          setGroupedInstruments((groupedInstruments) =>
            groupedInstruments.map((i) => {
                  if(i.CE?.instrument_token === data.token){
                    i.CE.bid = data.bid;
                    i.CE.ask = data.ask;
                    return i
                  } else if(i.PE?.instrument_token === data.token){
                    i.PE.bid = data.bid;
                    i.PE.ask = data.ask;
                    return i
                  } else {
                    return i;
                  }
              } 
          ));
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
        <h3 className="text-xl font-bold">{name} - {segment}</h3>
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
              {/* <th scope="col" className="min-w-[5ch]">
                PE Value
              </th> */}
              <th scope="col" className="min-w-[5ch]">
                PE Ask
              </th>
              <th scope="col" className="min-w-[5ch]">
                PE Bid
              </th>
              <th scope="col">Strike</th>
              <th scope="col" className="min-w-[5ch]">
                CE Bid
              </th>
              <th scope="col" className="min-w-[5ch]">
                CE Ask
              </th>
              {/* <th scope="col" className="min-w-[5ch]">
                CE Value
              </th> */}
            </tr>
          </thead>
          <tbody className="text-zinc-900 dark:text-zinc-100 divide-y divide-zinc-200 dark:divide-white/10 bg-white dark:bg-zinc-900 overflow-y-auto">
            {filteredInstruments?.length > 0 && !['NIFTY MID SELECT', 'NIFTY FIN SERVICE','NIFTY BANK', 'NIFTY 50'].includes(name) ? (
              filteredInstruments.map((i) => (
                <TableRow key={i.strike} i={i} />
              ))
            ) : filteredGroupedInstruments?.length > 0 && ['NIFTY MID SELECT', 'NIFTY FIN SERVICE','NIFTY BANK', 'NIFTY 50'].includes(name)? (
              filteredGroupedInstruments.map((i) => (
                <TableRowOptions key={i.strike} i={i} ltp={ltp} />
              ))
            ) :  (
              <tr>
                <td colSpan={4}>No data to display.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

function groupUiInstrumentsByStrike(uiInstruments: UiInstrument[]): GroupedUiInstrument[] {
  const groupedData: GroupedUiInstrument[] = [];

  uiInstruments.forEach((instrument) => {
      const { strike, instrument_type } = instrument;

      let existingGroup = groupedData.find(group => group.strike === strike);

      if (!existingGroup) {
          existingGroup = { strike, CE: null, PE: null };
          groupedData.push(existingGroup);
      }

      if (instrument_type === 'CE') {
          existingGroup.CE = instrument;
      } else if (instrument_type === 'PE') {
          existingGroup.PE = instrument;
      }
  });

  return groupedData.sort((a,b) => (a.strike > b.strike) ? -1 : 1);
}