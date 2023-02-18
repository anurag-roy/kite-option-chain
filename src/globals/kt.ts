import env from '@/env.json';
import { readFileSync } from 'node:fs';
import { GlobalRef } from './GlobalRef';
import { clients, tokenMap } from './maps';

const processTicks = (dataView: DataView) => {
  const numberOfPackets = dataView.getInt16(0);
  let index = 2;

  for (let i = 0; i < numberOfPackets; i++) {
    const size = dataView.getInt16(index);
    const token = dataView.getInt32(index);

    const socketId = tokenMap.get(token);
    if (!socketId) {
      continue;
    }
    const socketClient = clients.get(socketId)!;
    if (!socketClient) {
      continue;
    }

    if (size === 8) {
      socketClient?.send(
        JSON.stringify({
          action: 'ltp-update',
          data: {
            ltp: dataView.getInt32(index + 6),
          },
        })
      );
    } else if (size === 184) {
      socketClient?.send(
        JSON.stringify({
          action: 'option-update',
          data: {
            token: token,
            bid: dataView.getInt32(index + 70) / 100,
            ask: dataView.getInt32(index + 130) / 100,
          },
        })
      );
    }

    index = index + 2 + size;
  }
};

const ws = new GlobalRef<WebSocket>('myapp.kiteticker');
if (!ws.value) {
  let accessToken = undefined;
  try {
    accessToken = readFileSync('src/data/accessToken.txt', 'utf-8');
    ws.value = new WebSocket(
      `wss://ws.kite.trade?api_key=${env.API_KEY}&access_token=${accessToken}`
    );

    ws.value.onopen = (_event) => {
      console.log('KiteTicker connected and ready to subscribe!');
    };

    ws.value.onerror = (err) => {
      console.log('Error connecting to kiteTicker', err);
    };

    ws.value.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer && event.data.byteLength > 2) {
        const dataView = new DataView(event.data);
        processTicks(dataView);
      }
    };
  } catch (error) {
    console.log('Access token not found. Cannot initialize KiteTicker.');
  }
}

export const kt = ws.value;
