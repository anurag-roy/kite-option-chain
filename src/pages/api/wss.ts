import { NextApiHandler } from 'next';
import { NextWebSocketHandler } from 'next-plugin-websocket';

type WebSocket = Parameters<NextWebSocketHandler>['0'];

const clients = new Map<string, WebSocket>();

export const socket: NextWebSocketHandler = (client, req) => {
  if (req.url) {
    const url = new URL(req.url, 'http://localhost:8000');
    const name = url.searchParams.get('name');
    const expiry = url.searchParams.get('expiry');
    console.log({ name, expiry });
    if (name && expiry) {
      clients.set(name, client);

      client.on('close', () => {
        console.log('Client disconnected');
        clients.delete(name);
      });
    }
  }
};

const handler: NextApiHandler = (_req, res) => {
  res.status(405).end();
};

export default handler;
