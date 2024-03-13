import { DIFF_PERCENT } from '@/config';
import { clients, kc, kt, tokenMap } from '@/globals';
import { UiInstrument } from '@/types/SocketData';
import { getEquityInstrumentsToSubscribe, getOptionInstrumentsToSubscribe } from '@/utils/db';
import { mapIndexOptionsExpiry } from '@/utils/expiry';
import { NextApiHandler } from 'next';
import { NextWebSocketHandler } from 'next-plugin-websocket';

export const socket: NextWebSocketHandler = async (client, req) => {
  if (req.url) {
    const url = new URL(req.url, 'http://localhost:9000');
    const name = url.searchParams.get('name');
    const expiry = url.searchParams.get('expiry');

    if (name && expiry) {
      clients.set(name, client);

      // Actions on socket client disconnecting
      client.on('close', () => {
        // Remove from clients map
        clients.delete(name);

        // Unsubscribe ticker from all associated tokens
        const tokensToUnsubscribe: number[] = [];
        for (const [token, stockName] of tokenMap) {
          if (stockName === name) {
            tokensToUnsubscribe.push(token);
            tokenMap.delete(token);
          }
        }
        kt.unsubscribe(tokensToUnsubscribe);
      });


      const {equityStock } = await getEquityInstrumentsToSubscribe(name, expiry);

      const {mappedName , mappedExpiry } = mapIndexOptionsExpiry(name, expiry);
      const {optionsStocks } = await getOptionInstrumentsToSubscribe(mappedName, mappedExpiry);



      // Get LTP to calculate lower bound and upper bound
      const response = await kc.getOHLC([equityStock.id]);
      const ohlcResponse = response[equityStock.id];
      const lowerBound =
        equityStock.tradingsymbol === 'ADANIENT'
          ? 0.5 * ohlcResponse.last_price
          : ((100 - DIFF_PERCENT) * ohlcResponse.last_price) / 100;
      const upperBound =
        equityStock.tradingsymbol === 'ADANIENT'
          ? 1.5 * ohlcResponse.last_price
          : ((100 + DIFF_PERCENT) * ohlcResponse.last_price) / 100;

      // Compute filtered stocks to send the scoket client
      const filteredOptionStocks: UiInstrument[] = [];
      const optionStocksToSubscribe: number[] = [];
      for (const stock of optionsStocks) {
        if ( stock.strike >= lowerBound && stock.strike <= upperBound ) {
          filteredOptionStocks.push({
            ...stock,
            bid: 0,
            ask: 0,
          });
          // Store token, to later unsubscribe easily
          tokenMap.set(stock.instrument_token, name);
          optionStocksToSubscribe.push(stock.instrument_token);
        }
      }
      console.log(`Stock ${mappedName}, price ${ohlcResponse.last_price}, lb ${lowerBound}, up ${upperBound} osc ${filteredOptionStocks.length}`);
      // Store the equity instrument as well
      tokenMap.set(equityStock.instrument_token, name);

      // Send client init data
      client.send(
        JSON.stringify({
          action: 'init',
          data: {
            ltp: ohlcResponse.last_price,
            previousClose: ohlcResponse.ohlc.close,
            options: filteredOptionStocks,
          },
        })
      );

      // Only ltp is required for equity instrument
      kt.setMode('ltp', [equityStock.instrument_token]);
      kt.setMode(
        'full',
        filteredOptionStocks.map((o) => o.instrument_token)
      );
    }
  }
};

const handler: NextApiHandler = (_req, res) => {
  res.status(405).end();
};

export default handler;
