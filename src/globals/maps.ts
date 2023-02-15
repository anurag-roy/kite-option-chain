import { NextWebSocketHandler } from 'next-plugin-websocket';
import { GlobalRef } from './GlobalRef';

type WebSocket = Parameters<NextWebSocketHandler>['0'];

const clientMapRef = new GlobalRef<Map<string, WebSocket>>('myapp.clients');
if (!clientMapRef.value) {
  clientMapRef.value = new Map<string, WebSocket>();
}

const tokenMapRef = new GlobalRef<Map<number, string>>('myapp.tokenmap');
if (!tokenMapRef.value) {
  tokenMapRef.value = new Map<number, string>();
}

export const clients = clientMapRef.value;
export const tokenMap = tokenMapRef.value;
