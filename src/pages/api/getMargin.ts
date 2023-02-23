import { kc } from '@/globals';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const { price, quantity, tradingsymbol } = req.query;

  const [marginResponse] = await kc.orderMargins(
    [
      {
        exchange: 'NFO',
        order_type: 'LIMIT',
        price: Number(price),
        product: 'NRML',
        quantity: Number(quantity),
        tradingsymbol: tradingsymbol as string,
        transaction_type: 'SELL',
        variety: 'regular',
        trigger_price: 0,
      },
    ],
    'compact'
  );

  return res.json({
    total: marginResponse.total,
  });
};

export default handler;
