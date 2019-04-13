// https://www.alphavantage.co/documentation/
// https://github.com/zackurben/alphavantage
const universe = require("./utils/universe");
const alpha = require("alphavantage")({ key: process.env.apiKey });
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const StocksScreener = require("./StocksScreener");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ stocks: [] }).write();

populateDB();

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(fn, ...args) {
  await timeout(30000);
  return fn(...args);
}

async function populateDB() {
  console.log("Start populating db");
  for (let stock of universe.universe) {
    await sleep(() => {
      return alpha.data
        .daily(stock)
        .then(data => {
          db.get("stocks")
            .push({ [stock]: polishData(data) })
            .write();
        })
        .then(() => {
          console.log("writing ", stock, "... done!");
        })
        .catch(err => console.log(err));
    });
  }

  console.log("Done!");
}

function polishData(data) {
  const polished = alpha.util.polish(data);
  const dataArray = Object.keys(polished.data).map(key => ({
    [key]: polished.data[key]
  }));
  return dataArray;
}

alpha.technical.adx("AAPL", "daily", 25).then(res => {
  console.log("test adx ", alpha.util.polish(res));
});

// const stocksScreener = new StocksScreener();
// stocksScreener.bearishEngulfing();
// stocksScreener.bullishEngulfing();