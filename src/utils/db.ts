import { db } from '../globals';

export const getInstrumentsToSubscribe = async (
  stockName: string,
  expiryPrefix: string
) => {
    const equityStock = await db.instrument.findFirstOrThrow({
    where: {
      id: `NSE:${stockName}`,
      tradingsymbol: stockName,
      instrument_type: 'EQ',
      exchange: 'NSE',
    },
  });
  const optionsStocks = await db.instrument.findMany({
    where: {
      name: stockName,
      exchange: 'NFO',
      instrument_type: {
        in: ['CE', 'PE'],
      },
      expiry: {
        startsWith: expiryPrefix,
      },
    },
    orderBy: {
      strike: 'asc',
    },
  }
  );
  //console.log(`Equity Stocks `, equityStock);
  //console.log(`Option Stocks `, optionsStocks);
  return {
    equityStock,
    optionsStocks,
  };
};

export const getEquityInstrumentsToSubscribe = async (
  stockName: string,
  expiryPrefix: string
) => {
    const equityStock = await db.instrument.findFirstOrThrow({
    where: {
      id: `NSE:${stockName}`,
      tradingsymbol: stockName,
      instrument_type: 'EQ',
      exchange: 'NSE',
    },
  });
  //console.log(`Equity Stocks `, equityStock);
  return {
    equityStock,
  };
};


export const getOptionInstrumentsToSubscribe = async (
  stockName: string,
  expiryPrefix: string
) => {

    const optionsStocks = await db.instrument.findMany({
    where: {
      name: stockName,
      exchange: 'NFO',
      instrument_type: {
        in: ['CE', 'PE'],
      },
      expiry: {
        startsWith: expiryPrefix,
      },
    },
    orderBy: {
      strike: 'asc',
    },
  }
  );
  //console.log(`Option Stocks `, optionsStocks);
  return {
    optionsStocks,
  };
};
