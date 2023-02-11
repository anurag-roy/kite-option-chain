import env from '@/env.json';
import { KiteConnect } from 'kiteconnect-ts';
import type { NextApiHandler } from 'next';
import { writeFileSync } from 'node:fs';

const handler: NextApiHandler = async (req, res) => {
  const url = new URL(req.url!);
  const requestToken = url.searchParams.get('request_token');

  if (!requestToken) {
    res.status(400).send('No request token found. Login not successful.');
    return;
  }

  const kc = new KiteConnect({ api_key: env.API_KEY });
  try {
    const { access_token } = await kc.generateSession(
      requestToken,
      env.API_SECRET
    );
    writeFileSync('src/data/accessToken.txt', access_token);
    res.send('Login successful!');
  } catch (error) {
    console.log('Error while generating session', error);
    res.status(401).send('Authorization failure. Login not successful.');
  }
};

export default handler;
