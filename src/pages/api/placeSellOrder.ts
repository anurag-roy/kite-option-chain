import { kc } from '@/globals';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const { price, quantity, tradingsymbol } = req.query;

  const orderId = await kc.placeOrder('regular', {
    exchange: 'NSE',
    order_type: 'LIMIT',
    price: Number(price),
    product: 'NRML',
    quantity: Number(quantity),
    tradingsymbol: tradingsymbol as string,
    transaction_type: 'SELL',
  });

  return res.json({ orderId });
};

export default handler;
