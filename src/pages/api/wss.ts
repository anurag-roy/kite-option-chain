import { NextApiHandler } from 'next';
import { NextWebSocketHandler } from 'next-plugin-websocket';

export const socket: NextWebSocketHandler = (client, req) => {
  console.log('Client connected');

  client.on('message', (msg) => {
    client.send(msg);
  });

  client.on('close', () => {
    console.log('Client disconnected');
  });
};

// You still need to expose a regular HTTP handler, even if you only intend to
// use this API route for WebSocket connections.
const handler: NextApiHandler = (req, res) => {
  res.status(426).send('Upgrade Required');
};

export default handler;
