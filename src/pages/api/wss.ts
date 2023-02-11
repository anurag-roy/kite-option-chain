import { NextApiHandler } from 'next';
import { NextWebSocketHandler } from 'next-plugin-websocket';

type WebSocket = Parameters<NextWebSocketHandler>['0'];

const clients = new Map<string, WebSocket>();

export const socket: NextWebSocketHandler = (client, req) => {
  if (req.url) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      clients.set(id, client);

      client.on('close', () => {
        console.log('Client disconnected');
        clients.delete(id);
      });
    }
  }
};

const handler: NextApiHandler = (_req, res) => {
  res.status(405).end();
};

export default handler;
