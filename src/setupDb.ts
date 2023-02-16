import { getKeys } from '@/utils/ui';
import Database from 'better-sqlite3';
import { GROUPS } from './config';
import { kc } from './globals';

const allowedStocks = Object.values(GROUPS).flatMap((s) => s);

const getSqliteType = (key: string, value: any) => {
  if (key === 'instrument_token') return 'INTEGER';
  else return typeof value === 'number' ? 'REAL' : 'TEXT';
};

async function main() {
  const nseInstruments = await kc.getInstruments(['NSE']);
  const nfoInstruments = await kc.getInstruments(['NFO']);

  const instruments = [
    ...nseInstruments.filter((i) => allowedStocks.includes(i.tradingsymbol)),
    ...nfoInstruments.filter(
      (i) => allowedStocks.includes(i.name) && i.segment === 'NFO-OPT'
    ),
  ];

  const columns = getKeys(instruments[0]);

  const TABLE_NAME = 'instrument';
  const INSERT_BATCH_SIZE = 10000;

  // Create DB and table
  const db = new Database('src/data/data.db');
  console.log('DB creation successful!');

  db.prepare(
    `CREATE TABLE ${TABLE_NAME} (` +
      'id TEXT NOT NULL PRIMARY KEY,' +
      columns
        .map((c) => `${c} ${getSqliteType(c, instruments[0][c])} NOT NULL`)
        .join(',') +
      ');'
  ).run();
  console.log('Table creation successful!');

  const insert = (values: string[]) => {
    if (values.length === 0) return;
    db.exec(
      `INSERT INTO ${TABLE_NAME} (id, ${columns.join(
        ','
      )}) VALUES ${values.join(',')};`
    );
  };

  // Variables to insert values in batches
  let currentBatchValues = [];
  let currentIteration = 0;

  console.log('Starting insert...');
  for (const instrument of instruments) {
    const currentRowValues = [];

    // Insert primary key Id
    currentRowValues.push(
      `'${instrument.exchange}:${instrument.tradingsymbol}'`
    );

    for (const col of columns) {
      let value = instrument[col];
      value = typeof value === 'object' ? value.toISOString() : value;
      value = typeof value === 'string' ? `'${value}'` : value;
      currentRowValues.push(value);
    }
    currentBatchValues.push(`(${currentRowValues.join(',')})`);

    // Execute insert statement once a batch is full
    currentIteration++;
    if (currentIteration % INSERT_BATCH_SIZE === 0) {
      insert(currentBatchValues);
      currentBatchValues = [];
    }
  }
  // Fire once more for leftover values
  insert(currentBatchValues);
  console.log('Data insertion successful!');
}

main().catch((error) => {
  console.log('Data preparation failed', error);
});
