import { GlobalRef } from './GlobalRef';

const mapRef = new GlobalRef<Map<number, string>>('myapp.tokenmap');
if (!mapRef.value) {
  mapRef.value = new Map<number, string>();
}

export const tokenMap = mapRef.value;
