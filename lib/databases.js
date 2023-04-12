"use strict";
// const _ = require('lodash');
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = void 0;
// const env = require('wnd-env');
const wnd_mongodb_1 = require("wnd-mongodb");
// const {MongoDb} = require('wnd-mongodb');
const dbs = new Map();
function getDatabase(databaseUrl) {
    let mongodb = dbs.get(databaseUrl);
    if (mongodb) {
        return mongodb;
    }
    mongodb = new wnd_mongodb_1.MongoDb(databaseUrl, { unsetTimestamp: true });
    dbs.set(databaseUrl, mongodb);
    return mongodb;
}
exports.getDatabase = getDatabase;
