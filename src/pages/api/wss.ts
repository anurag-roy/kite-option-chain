import { clients, kc, kt, tokenMap } from '@/globals';
import { getInstrumentsToSubscribe } from '@/utils/db';
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
        clients.delete(name);
        const tokensToUnsubscribe = Object.entries(Object.fromEntries(tokenMap))
          .filter(([_k, v]) => v === name)
          .map(([k, v]) => Number(k));
        kt.unsubscribe(tokensToUnsubscribe);
      });

      const { equityStock, optionsStocks } = await getInstrumentsToSubscribe(
        name,
        expiry
      );

      tokenMap.set(equityStock.instrument_token, name);
      optionsStocks.forEach((o) => tokenMap.set(o.instrument_token, name));

      const ohlcResponse = await kc.getOHLC([equityStock.id]);

      client.send(
        JSON.stringify({
          action: 'init',
          data: {
            ltp: ohlcResponse[equityStock.id].last_price,
            previousClose: ohlcResponse[equityStock.id].ohlc.close,
            options: optionsStocks.map((s) => ({ ...s, bid: 0, ask: 0 })),
          },
        })
      );

      kt.setMode('ltp', [equityStock.instrument_token]);
      kt.setMode(
        'full',
        optionsStocks.map((o) => o.instrument_token)
      );
    }
  }
};

const handler: NextApiHandler = (_req, res) => {
  res.status(405).end();
};

export default handler;
