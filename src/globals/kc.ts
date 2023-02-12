import env from '@/env.json';
import { KiteConnect } from 'kiteconnect-ts';
import { readFileSync } from 'node:fs';
import { GlobalRef } from './GlobalRef';

const kiteConnect = new GlobalRef<KiteConnect>('myapp.kiteconnect');
if (!kiteConnect.value) {
  let accessToken = undefined;
  try {
    accessToken = readFileSync('src/data/accessToken.txt', 'utf-8');
  } catch (error) {
    console.log(
      'Access token not found. Initializing KiteConnect without access token.'
    );
  }
  kiteConnect.value = new KiteConnect({
    api_key: env.API_KEY,
    access_token: accessToken,
  });
}

export const kc = kiteConnect.value;
