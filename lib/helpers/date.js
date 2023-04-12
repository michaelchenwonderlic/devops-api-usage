const moment = require('moment-timezone');
const env = require('wnd-env');

const timezone = env.get('TIMEZONE');

function DateHelpers() {}

DateHelpers.prototype.setTime = function(dateTime, hour = 0, minute = 0, second = 0, millisecond = 0) {
  return moment(dateTime).tz(timezone).hour(hour).minute(minute).second(second).millisecond(millisecond).toDate();
};

DateHelpers.prototype.format = function(date, formatString) {
  return moment(date).format(formatString || 'MM/DD/YYYY');
};

module.exports = new DateHelpers();
