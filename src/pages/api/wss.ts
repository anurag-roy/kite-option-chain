import { clients, kt, tokenMap } from '@/globals';
import { getInstrumentsToSubscribe } from '@/utils';
import { NextApiHandler } from 'next';
import { NextWebSocketHandler } from 'next-plugin-websocket';

export const socket: NextWebSocketHandler = async (client, req) => {
  if (req.url) {
    const url = new URL(req.url, 'http://localhost:8000');
    const name = url.searchParams.get('name');
    const expiry = url.searchParams.get('expiry');

    if (name && expiry) {
      clients.set(name, client);

      client.on('close', () => {
        console.log('Client disconnected');
        clients.delete(name);
      });

      const { equityStock, optionsStocks } = await getInstrumentsToSubscribe(
        name,
        expiry
      );

      tokenMap.set(Number(equityStock.instrument_token), name);
      optionsStocks.forEach((o) =>
        tokenMap.set(Number(o.instrument_token), name)
      );

      kt.setMode('ltp', [Number(equityStock.instrument_token)]);
      kt.setMode(
        'full',
        optionsStocks.map((o) => Number(o.instrument_token))
      );
    }
  }
};

const handler: NextApiHandler = (_req, res) => {
  res.status(405).end();
};

export default handler;
