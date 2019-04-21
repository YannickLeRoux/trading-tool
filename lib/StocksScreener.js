var universe = require('./utils/universe');
var alpha = require('alphavantage')({ key: process.env.apiKey });
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
var StocksScreener = (function () {
    function StocksScreener() {
        this.universe = universe.universe;
        this.dailyData = db.getState();
    }
    StocksScreener.prototype.isBullish = function () {
    };
    StocksScreener.prototype.bullishEngulfing = function () {
        var res = [];
        for (var _i = 0, _a = this.dailyData.stocks; _i < _a.length; _i++) {
            var stock = _a[_i];
            var dataArray = Object.values(stock)[0];
            var day1 = Object.values(dataArray[1])[0];
            var day2 = Object.values(dataArray[0])[0];
            if (day1.close < day1.open && day2.close > day2.open && day2.open < day1.close && day2.close > day1.open) {
                res.push(Object.keys(stock)[0]);
            }
        }
        console.log.apply(console, ['Stocks in a bullish engulfing pattern are '].concat(res));
    };
    StocksScreener.prototype.bearishEngulfing = function () {
        var res = [];
        for (var _i = 0, _a = this.dailyData.stocks; _i < _a.length; _i++) {
            var stock = _a[_i];
            var dataArray = Object.values(stock)[0];
            var day1 = Object.values(dataArray[1])[0];
            var day2 = Object.values(dataArray[0])[0];
            if (day1.close > day1.open && day2.close < day2.open && day2.open > day1.close && day2.close < day1.open) {
                res.push(Object.keys(stock)[0]);
            }
        }
        console.log.apply(console, ['Stocks in a bearish engulfing pattern are '].concat(res));
    };
    StocksScreener.prototype.morningStar = function () {
        debugger;
        var res = [];
        for (var _i = 0, _a = this.dailyData.stocks; _i < _a.length; _i++) {
            var stock = _a[_i];
            var dataArray = Object.values(stock)[0];
            var day1 = Object.values(dataArray[2])[0];
            var day2 = Object.values(dataArray[1])[0];
            var day3 = Object.values(dataArray[0])[0];
            if (day1.close < day1.open && day2.open < day1.open && day2.open < day2.close && day3.open < day3.close) {
                res.push(Object.keys(stock)[0]);
            }
        }
        console.log.apply(console, ['Stocks in a morning star pattern are '].concat(res));
    };
    StocksScreener.prototype.polishData = function (data) {
        var polished = alpha.util.polish(data);
        var dataArray = Object.keys(polished.data).map(function (key) {
            var _a;
            return (_a = {},
                _a[key] = polished.data[key],
                _a);
        });
        return dataArray;
    };
    return StocksScreener;
}());
module.exports = StocksScreener;
//# sourceMappingURL=StocksScreener.js.map