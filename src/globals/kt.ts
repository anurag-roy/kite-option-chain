import env from '@/env.json';
import { readFileSync } from 'node:fs';
import { WebSocket } from 'ws';
import { GlobalRef } from './GlobalRef';
import { clients, tokenMap } from './maps';

const processTicks = (buffer: Buffer) => {
  const numberOfPackets = buffer.readInt16BE(0);
  let index = 2;

  for (let i = 0; i < numberOfPackets; i++) {
    const size = buffer.readInt16BE(index);
    const token = buffer.readInt32BE(index);

    const socketId = tokenMap.get(token);
    if (!socketId) {
      continue;
    }
    const socketClient = clients.get(socketId)!;
    if (!socketClient) {
      continue;
    }

    if (size === 8) {
      const message = {
        action: 'ltp-update',
        data: {
          ltp: buffer.readInt32BE(index + 6) / 100,
        },
      };
      console.log('Sending message', message);
      socketClient?.send(JSON.stringify(message));
    } else if (size === 184) {
      const message = {
        action: 'option-update',
        data: {
          token: token,
          bid: buffer.readInt32BE(index + 70) / 100,
          ask: buffer.readInt32BE(index + 130) / 100,
        },
      };
      console.log('Sending message', message);
      socketClient?.send(JSON.stringify(message));
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
      if (event.data instanceof Buffer && event.data.byteLength > 2) {
        processTicks(event.data);
      }
    };
  } catch (error) {
    console.log('Access token not found. Cannot initialize KiteTicker.', error);
  }
}

export const kt = ws.value;
