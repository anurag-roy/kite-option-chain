import env from '@/env.json';
import { KiteTicker, TickFull, TickLtp } from 'kiteconnect-ts';
import { readFileSync } from 'node:fs';
import { GlobalRef } from './GlobalRef';
import { clients, tokenMap } from './maps';

const kiteTicker = new GlobalRef<KiteTicker>('myapp.kiteticker');
if (!kiteTicker.value) {
  let accessToken = undefined;
  try {
    accessToken = readFileSync('src/data/accessToken.txt', 'utf-8');
    kiteTicker.value = new KiteTicker({
      api_key: env.API_KEY,
      access_token: accessToken,
    });

    kiteTicker.value.on('connect', () => {
      console.log('KiteTicker connected and ready to subscribe!');
    });

    kiteTicker.value.on('error', (err: any) => {
      console.log('Error connecting to kiteTicker', err);
    });

    kiteTicker.value.on('ticks', (ticks: (TickLtp | TickFull)[]) => {
      ticks.forEach((t) => {
        const socketId = tokenMap.get(t.instrument_token);
        if (!socketId) {
          return;
        }

        const socketClient = clients.get(socketId)!;
        if (!socketClient) {
          return;
        }

        let message: any;
        if (t.mode === 'ltp') {
          message = {
            action: 'ltp-update',
            data: {
              ltp: t.last_price,
            },
          };
        } else {
          message = {
            action: 'option-update',
            data: {
              token: t.instrument_token,
              bid: t.depth.buy[0].price,
              ask: t.depth.sell[0].price,
            },
          };
        }
        socketClient?.send(JSON.stringify(message));
      });
    });
  } catch (error) {
    console.log('Access token not found. Cannot initialize KiteTicker.');
  }
}

export const kt = kiteTicker.value;
