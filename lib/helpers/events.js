const _ = require('lodash');
const Q = require('q');

const _changedRE = /^(changed\.)/;

function EventsHelper() {}

EventsHelper.prototype.notifyIfChanged = function(db, entityType, object, originalData, isLiveRun = true, logger) {
  const self = this;
  const promises = [];

  _.forEach(object.eventSubscriptions, function(eventSubscription) {
    if (eventSubscription.type !== 'WebHook') { return; }

    const triggeredEvents = [];

    _.forEach(eventSubscription.events, function(event) {
      if (_changedRE.test(event)) {
        const fieldPath = event.replace(_changedRE, '');
        const currData = _.get(object, fieldPath);
        const origData = _.get(originalData, fieldPath);
        if (!_.isEqual(currData, origData)) {
          triggeredEvents.push({event: event, value: currData});
        }
      }
    });

    if (triggeredEvents.length > 0) {
      console.log('Queued new EventSubscription notification for', eventSubscription.address, '-', _.pluck(triggeredEvents, 'event'));
      promises.push(self._insertQueueMessage(db, eventSubscription.address, entityType, object.id.toString(), triggeredEvents, isLiveRun, logger));
    }
  });

  return Q.all(promises);
};

EventsHelper.prototype._insertQueueMessage = function(db, address, entityType, entityId, triggeredEvents, isLiveRun = true, logger) {
  const doc = {
    type: 'EventSubscriptions.WebHook',
    message: {
      address: address,
      notification: {
        entityType: entityType,
        entityId: entityId,
        timestamp: new Date(),
        events: triggeredEvents
      }
    }
  };

  if (logger) {
    logger.logLine(`${isLiveRun ? '[Live Run] ' : '[Test Run] '} EventSubscription`, doc);
  }
  if (isLiveRun) {
    return db.collection('_queue').insertOne(doc);
  }
  return Promise.resolve();
};

module.exports = new EventsHelper();
