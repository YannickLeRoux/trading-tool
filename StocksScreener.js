const universe = require("./utils/universe");
const alpha = require("alphavantage")({ key: process.env.apiKey });
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

class StocksScreener {
  constructor() {
    this.universe = universe.universe;
    this.dailyData = db.getState();
  }

  bullishEngulfing() {
    const res = [];
    for (let stock of this.dailyData.stocks) {
      const dataArray = Object.values(stock)[0];
      const day1 = Object.values(dataArray[1])[0];
      const day2 = Object.values(dataArray[0])[0];
      if (day2.open > day1.close && day2.close < day1.open) {
        console.log(`${Object.keys(stock)[0]} has a bullish engulfing pattern`);
      } else {
        console.log(
          `${Object.keys(stock)[0]} has NOT a bullish engulfing pattern`
        );
      }
    }
  }

  bearishEngulfing() {
    const res = [];
    for (let stock of this.dailyData.stocks) {
      const dataArray = Object.values(stock)[0];
      const day1 = Object.values(dataArray[1])[0];
      const day2 = Object.values(dataArray[0])[0];
      if (day2.open > day1.close && day2.close < day1.open) {
        console.log(`${Object.keys(stock)[0]} has a bearish engulfing pattern`);
      } else {
        console.log(
          `${Object.keys(stock)[0]} has NOT a bearish engulfing pattern`
        );
      }
    }
  }

  morningStar() {
    // end of down trend

    const res = [];
    for (let stock of this.dailyData.stocks) {
      const dataArray = Object.values(stock)[0];
      const day1 = Object.values(dataArray[2])[0];
      const day2 = Object.values(dataArray[1])[0];
      const day3 = Object.values(dataArray[0])[0];
      if (
        day1.close < day1.open &&
        day2.open < day1.open &&
        day2.open < day2.close &&
        day3.open < day3.close
      ) {
        console.log(`${Object.keys(stock)[0]} has a morning star pattern`);
      } else {
        console.log(`${Object.keys(stock)[0]} has NOT a morning star pattern`);
      }
    }
  }

  polishData(data) {
    const polished = alpha.util.polish(data);
    const dataArray = Object.keys(polished.data).map(key => ({
      [key]: polished.data[key]
    }));
    return dataArray;
  }
}

module.exports = StocksScreener;
