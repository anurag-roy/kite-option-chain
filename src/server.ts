import next from 'next';
import { createServer } from 'node:http';
import { setInterval } from 'node:timers';
import { parse } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const clients = new Set<WebSocket>();

app.prepare().then(() => {
  const server = createServer((req, res) =>
    handle(req, res, parse(req.url!, true))
  );

  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.onclose = () => {
      console.log('connection closed', wss.clients.size);
    };
  });

  setInterval(() => {
    clients.forEach((client) => client.send('Hello!'));
  }, 1000);

  server.on('upgrade', function (req, socket, head) {
    const { pathname } = parse(req.url!, true);
    if (pathname !== '/_next/webpack-hmr') {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, req);
      });
    }
  });

  server.listen(3000, () => {
    console.log(
      `> Ready on http://localhost:${3000} and ws://localhost:${3000}`
    );
  });
});
