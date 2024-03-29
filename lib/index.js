"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var universe = require('./utils/universe');
var alpha = require('alphavantage')({ key: process.env.apiKey });
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var StocksScreener = require('./StocksScreener');
var adapter = new FileSync('db.json');
console.log(adapter);
var db = low(adapter);
db.defaults({ stocks: [] }).write();
populateDB();
function timeout(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function sleep(fn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, timeout(30000)];
                case 1:
                    _a.sent();
                    return [2, fn.apply(void 0, args)];
            }
        });
    });
}
function populateDB() {
    return __awaiter(this, void 0, void 0, function () {
        var dbString, _loop_1, _i, _a, stock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Start populating db');
                    dbString = JSON.stringify(db.getState());
                    _loop_1 = function (stock) {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    debugger;
                                    if (!!dbString.includes(stock)) return [3, 2];
                                    return [4, sleep(function () {
                                            return alpha.data
                                                .daily(stock)
                                                .then(function (data) {
                                                var _a;
                                                db.get('stocks')
                                                    .push((_a = {}, _a[stock] = polishData(data), _a))
                                                    .write();
                                            })
                                                .then(function () {
                                                console.log('writing ', stock, '... done!');
                                            })
                                                .catch(function (err) { return console.log(err); });
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2];
                            }
                        });
                    };
                    _i = 0, _a = universe.universe;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    stock = _a[_i];
                    return [5, _loop_1(stock)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4:
                    console.log('Done!');
                    return [2];
            }
        });
    });
}
function polishData(data) {
    var polished = alpha.util.polish(data);
    var dataArray = Object.keys(polished.data).map(function (key) {
        var _a;
        return (_a = {},
            _a[key] = polished.data[key],
            _a);
    });
    return dataArray;
}
//# sourceMappingURL=index.js.map