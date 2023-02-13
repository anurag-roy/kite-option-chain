import { NextWebSocketHandler } from 'next-plugin-websocket';
import { GlobalRef } from './GlobalRef';

type WebSocket = Parameters<NextWebSocketHandler>['0'];

const mapRef = new GlobalRef<Map<string, WebSocket>>('myapp.clients');
if (!mapRef.value) {
  mapRef.value = new Map<string, WebSocket>();
}

export const clients = mapRef.value;
