import { getKeys } from '@/utils';
import Database from 'better-sqlite3';
import { kc } from './globals/kc';

const getSqliteType = (value: any) =>
  typeof value === 'number' ? 'REAL' : 'TEXT';

async function main() {
  const instruments = await kc.getInstruments();

  const columns = getKeys(instruments[0]);

  const TABLE_NAME = 'instrument';
  const INSERT_BATCH_SIZE = 10000;

  // Create DB and table
  const db = new Database('src/data/data.db');
  console.log('DB creation successful!');

  db.prepare(
    `CREATE TABLE ${TABLE_NAME} (` +
      'id TEXT NOT NULL PRIMARY KEY,' +
      columns.map((c) => `${c} ${getSqliteType(c)} NOT NULL`).join(',') +
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
      const value = instrument[col];
      currentRowValues.push(typeof value === 'string' ? `'${value}'` : value);
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

try {
  main();
} catch (error) {
  console.log('Data preparation failed', error);
}
