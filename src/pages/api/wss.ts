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

      // Remove the client from the set when it disconnects
      client.on('close', () => {
        console.log('Client disconnected');
        clients.delete(id);
      });
    }
  }
};

// When you call the API route, broadcast to all clients, for example
const handler: NextApiHandler = (_req, res) => {
  res.status(405).end();
};

export default handler;
