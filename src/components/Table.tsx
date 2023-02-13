import { useEffect, useState } from 'react';

type TableProps = {
  name: string;
  expiry: string;
};

export function Table({ name, expiry }: TableProps) {
  // TODO: Add type here
  const [instruments, setInstruments] = useState<any>([]);

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
        console.log('From server', event.data);
      };
      //clean up function
      return () => ws.close();
    }
  }, []);

  return (
    <div className="mx-8 mt-8 mb-4 overflow-y-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg grow">
      <table className="min-w-full h-full divide-y divide-gray-300">
        <thead className="bg-gray-50 sticky top-0">
          <tr className="divide-x divide-gray-200">
            <th scope="col">{name}</th>
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
            instruments?.map((i: any) => (
              <tr key={i.token} className="divide-x divide-gray-200">
                <td className="-px-4 font-normal text-gray-500">{i.name}</td>
                <td>{i.bid ?? '-'}</td>
                <td>{i.ask ?? '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
