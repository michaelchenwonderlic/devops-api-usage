const _ = require('lodash');
 const moment = require('moment');
const mongoDbs = require('../lib/mongoDbs');

class Runner {

  constructor() {
    this.callbacks = [];
    this.closeDbConnections = true;
  }

  processArgs(args) {
    for (const arg of args) {
      if (typeof arg === 'function') {
        this.callbacks.push(arg);
      } else if (typeof arg === 'object') {
        this.closeDbConnections = _.get(arg, 'closeDbConnections', true);
      }
    }
  }

  async runCallbacks() {
    for (const callback of this.callbacks) {
      await callback();
    }
  }

  run(...args) {
    this.processArgs(args);

    (async () => {
      try {
        await this.runCallbacks();
        console.log('Script Run Success.');
      } catch (err) {
        console.error('Script Run Failure.');
        console.error('Error', err.stack);
      } finally {
        if (this.closeDbConnections) {
          console.log('Closing DB connections.');
          mongoDbs.close();
        }
      }
    })();
  }

  arg(argName) {
    for (const arg of process.argv) {
      const tokens = arg.split('=');
      if(tokens.length === 2 && _.first(tokens).toLowerCase() === argName.toLowerCase()) {
        return this._buildArg(_.last(tokens));
      }
    }

    return this._buildArg()
  }

  _buildArg(value = '') {

   return {
     toString() {
       return value.toString()
     },
     toBool() {
       const lower = value.toLowerCase();
       if (lower === 'true') { return true; }
       if (lower === 'false') { return false; }
       return !!value;
     },
     toNumber() {
       return !!value ? Number(value) : NaN;
     },
     toMoment() {
       return !!value ? moment(new Date(value)) : null;
     },
     toDate() {
       return !!value ? this.toMoment().toDate() : null;
     },
     isDefined() {
       return !!value;
     }
   };
  }

  require(...requiredArgs) {
    for (const requiredArg of requiredArgs) {
      const value = this.arg(requiredArg);
      if (!value.isDefined()) {
        throw new Error(`${requiredArg} is required.`);
      }
    }
  }

  isLiveRun() {
    return _.some(process.argv, arg => arg.toLowerCase() === '--liverun');
  }

}

module.exports = new Runner();
