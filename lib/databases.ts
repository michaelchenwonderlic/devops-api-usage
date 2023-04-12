// const _ = require('lodash');


// const env = require('wnd-env');
import { MongoDb } from 'wnd-mongodb';
import {Env} from './env';
// const {MongoDb} = require('wnd-mongodb');

const dbs: Map<string, MongoDb> = new Map();

export function getDatabase(databaseUrl: string): MongoDb {
  let mongodb = dbs.get(databaseUrl);
  if (mongodb) {
    return mongodb;
  }

  mongodb = new MongoDb(databaseUrl, {unsetTimestamp: true})

  dbs.set(databaseUrl, mongodb);

  return mongodb;
}
