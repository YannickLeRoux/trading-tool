import { AdapterSync } from 'lowdb';

// https://www.alphavantage.co/documentation/
// https://github.com/zackurben/alphavantage
const universe: string[] = require('./utils/universe');
const alpha = require('alphavantage')({ key: process.env.apiKey });
const low = require('lowdb');
const FileSync: AdapterSync = require('lowdb/adapters/FileSync');
const StocksScreener = require('./StocksScreener');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ stocks: [] }).write();

populateDB();

function timeout(ms: number): Promise<() => {}> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(fn: any, ...args: any): Promise<any> {
  await timeout(30000);
  return fn(...args);
}

async function populateDB() {
  console.log('Start populating db');
  const dbString = JSON.stringify(db.getState());

  for (let stock of universe) {
    debugger;
    if (!dbString.includes(stock)) {
      await sleep(() => {
        return alpha.data
          .daily(stock)
          .then((data: any) => {
            db.get('stocks')
              .push({ [stock]: polishData(data) })
              .write();
          })
          .then(() => {
            console.log('writing ', stock, '... done!');
          })
          .catch((err: any) => console.log(err));
      });
    }
  }

  console.log('Done!');
}

function polishData(data: any) {
  const polished = alpha.util.polish(data);
  const dataArray = Object.keys(polished.data).map(key => ({
    [key]: polished.data[key]
  }));
  return dataArray;
}

// alpha.technical.sma('AAPL', 'daily', 9, 'close').then((res: any) => {
//   const a = Object.values(alpha.util.polish(res))[0];
//   const b = Object.values(a);
//   const c = Object.values(b);
//   console.log('test sma 9', c);
// });

// alpha.technical.sma('AAPL', 'daily', 4, 'close').then((res: any) => {
//   console.log('test sma 4', alpha.util.polish(res));
// });

// const stocksScreener = new StocksScreener();
// stocksScreener.bearishEngulfing();
// stocksScreener.bullishEngulfing();
// stocksScreener.morningStar();
// stocksScreener.hammer();
