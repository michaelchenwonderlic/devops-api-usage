const env = require('wnd-env');
const mongoDbs = require('../mongoDbs');
const moment = require('moment');

const dbsToLoad = [
  'integrationIcims_v2',
  'integrationIcims',
  'integrationGreenhouse',
  'integrationJobma',
  'integrationNewton',
  'integrationAcquireTm',
  'integrationApplicantPro',
  'integrationBizMerlin',
  'integrationHiringThing',
];

const range = 'week';
const periodAhead = 0;

function ApiUsage() {}

ApiUsage.prototype.getApiUsage = async function () {
  const starteDate = moment()
    .add(-1 * periodAhead, range)
    .startOf(range)
    .add(-1, range)
    .toDate();
  const endDate = moment()
    .add(-1 * periodAhead, range)
    .startOf(range)
    .toDate();
  const requestStats = {
    env: env.get('ENV'),
    range: { start: starteDate, end: endDate },
    capturedTime: new Date(),
    usage: [],
  };
  for (dbName of dbsToLoad) {
    const dbObj = mongoDbs[dbName];
    if (dbObj) {
      const dbCon = dbObj.getConnection();
      const requestLogCollection = dbCon.collection('_requestLogs');
      const query = {
        $and: [
          { endpoint: { $not: /.*health-check$/i } },
          { endpoint: { $not: /.*api-docs$/i } },
          { dateOfRequest: { $gte: starteDate } },
          { dateOfRequest: { $lt: endDate } },
        ],
      };

      const requestsCount = await requestLogCollection.count(query);
      requestStats.usage.push({ apiName: dbName, accessCount: requestsCount });
    } else {
      console.log(`Database ${dbName} does not exist`);
      requestStats.usage.push({ apiName: dbName, accessCount: undefined });
    }
  }
  return requestStats;
};

module.exports = new ApiUsage();
