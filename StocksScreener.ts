const universe = require("./utils/universe");
const alpha = require("alphavantage")({ key: process.env.apiKey });
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

export interface IStockScreener {
  universe: string[];
  dailyData: {}

}

class StocksScreener implements IStockScreener {
  universe: string[]
  dailyData: {stocks: []}

  constructor() {
    this.universe = universe.universe;
    this.dailyData = db.getState();
  }

  isBullshit() {
    // adx et dmi+
  }

  bullishEngulfing() {
    const res: [] = [];
    for (let stock of this.dailyData.stocks) {
      const dataArray: {} = Object.values(stock)[0];
      const day1: {} = Object.values(dataArray[1])[0];
      const day2: {} = Object.values(dataArray[0])[0];
      if (day2.open > day1.close && day2.close < day1.open) {
        res.push(Object.keys(stock)[0])
      }
    }
    console.log("Stocks in a bullish engulfing pattern are ", ...res)
  }

  bearishEngulfing() {
    const res = [];
    for (let stock of this.dailyData.stocks) {
      const dataArray = Object.values(stock)[0];
      const day1 = Object.values(dataArray[1])[0];
      const day2 = Object.values(dataArray[0])[0];
      if (day2.open > day1.close && day2.close < day1.open) {
        res.push(Object.keys(stock)[0])
      }
    }
    console.log("Stocks in a bearish engulfing pattern are ", ...res)

    }
  }

  public morningStar() {
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
        res.push(Object.keys(stock)[0])
      }
    }
    console.log("Stocks in a morning star pattern are ", ...res)
    }

    // create a signal with moving average nine days getting positive
    // or maybe when 4 days cross above 9 days


  polishData(data) {
    const polished = alpha.util.polish(data);
    const dataArray = Object.keys(polished.data).map(key => ({
      [key]: polished.data[key]
    }));
    return dataArray;
  }
}

module.exports = StocksScreener;
