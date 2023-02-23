import { kc } from '@/globals';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const { price, quantity, tradingsymbol } = req.body;

  const orderId = await kc.placeOrder('regular', {
    exchange: 'NFO',
    order_type: 'LIMIT',
    price: price,
    product: 'NRML',
    quantity: quantity,
    tradingsymbol: tradingsymbol,
    transaction_type: 'SELL',
  });

  return res.json({ orderId });
};

export default handler;
