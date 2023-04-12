const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');
const moment = require('moment');
const env = require('wnd-env');
const ObjectID = require('mongodb').ObjectID;

class Logger {
  static getFilePath(liveRun, fileName) {
    const rootPath = path.join(__dirname, '../'); // Go back a directory to get out of the 'helpers' sub-dir
    const scriptFile = process.argv[1]; // The script that is executing is the first argument

    fileName = fileName || path.basename(scriptFile, '.js') + '.txt';
    const basePath = path.dirname(scriptFile.replace(rootPath, ''));

    return `logs/${env.get('ENV')}/${basePath}/${moment().format('YYYY/MM/DD/YYYY.MM.DD_HHmmss')}-${
      liveRun ? '[LiveRun]-' : '[TestRun]-'
    }${fileName}`;
  }

  constructor(filePath) {
    // Create the output directory if it doesn't exist
    mkdirp.sync(path.parse(filePath).dir);

    this.outputFile = fs.createWriteStream(filePath, {flags: 'a'});
    console.log('output file: ', filePath);
  }

  close() {
    this.outputFile.end();
  }

  logLine(text, obj) {
    this.outputFile.write(text);
    if (obj) {
      if (obj instanceof Error) {
        // stringifying or directly writing an Error object to a file prints '{}'
        this.outputFile.write(obj.message);
      } else {
        this.outputFile.write(JSON.stringify(obj, '', ' '));
      }
    }
    this.outputFile.write('\r\n');
  }

  logLineBoth(text, obj) {
    console.log(text);
    if (obj) {
      console.log(util.inspect(obj));
    }
    this.logLine(text, obj);
  }

  async logAndApplyChanges(liveRun, type, collection, changedObj, originalObj, debug) {
    const changes = collection._getChanges(changedObj, originalObj);
    if (!_.isEmpty(changes)) {
      if (debug) {
        this.logLine(debug);
      }
      this.logLine(`${liveRun ? '[Live Run] ' : '[Test Run]'}Updating '${type}'`);
      this.logLine('Original: ' + util.inspect(originalObj, {depth: null}));
      this.logLine('Changes: ' + util.inspect(changes, {depth: null}));
      this.logLine('');

      if (liveRun) {
        return collection.saveChanges(changedObj, originalObj);
      }
    }
  }

  async logAndInsertOne(liveRun, type, collection, newDoc, debug) {
    if (debug) {
      this.logLine(debug);
    }
    this.logLine(`${liveRun ? '[Live Run] ' : '[Test Run]'} Inserting '${type}': `);
    this.logLine('Document: ' + util.inspect(newDoc, {depth: null}));
    this.logLine('');

    if (liveRun) {
      return collection.insertOne(newDoc);
    } else {
      return _.merge({id: new ObjectID().toString()}, newDoc);
    }
  }
}

module.exports = Logger;
