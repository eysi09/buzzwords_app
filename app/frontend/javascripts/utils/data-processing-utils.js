var moment = require('moment');

var DataProcessingUtils = {}

DataProcessingUtils.processTimeseriesData = function(data, queryWords, groupBy, dateGran) {
  console.log('Start processing timesseries data at ' + moment().format('HH:mm:ss'));
  var dp = DataProcessingUtils;
  var groupByKeys = dp.getGroupByKeys(data, groupBy);
  // TODO: Shorten strings
  var dateFormat = {
    'day': 'YYYYMMDD',
    'week': 'YYYYMMWW',
    'month': 'YYYYMM',
    'year': 'YYYY'
  }[dateGran];
  var processedData = _.chain(data)
    .reduce(function(memo, d) {
      var wordFreq = {};
      var party = d.party;
      _.each(queryWords, function(w) {
        wordFreq[dp.wfKeyBuilder(d, w, groupBy)] = parseInt(d['wf_' + w]) || 0;
      })
      var date = moment(d.date).format(dateFormat)
      if (!memo[date]) memo[date] = dp.initializeCount(queryWords, groupByKeys);
      memo[date] = dp.mergeAndAdd(memo[date], wordFreq);
      return memo;
    }, {})
    .reduce(function(memo, val, key) {
      memo.push(_.extend({date: moment(key, dateFormat).toDate()}, val));
      return memo;
    }, [])
    .sortBy('date')
    .value();
  console.log('Finish processing timeseries data at ' + moment().format('HH:mm:ss'));
  console.log(processedData);
  return processedData;
};

DataProcessingUtils.processBarchartData = function(data, queryWords, groupBy) {
  console.log('Start processing barchart data at ' + moment().format('HH:mm:ss'));
  var dp = DataProcessingUtils;
  var groupByKeys = dp.getGroupByKeys(data, groupBy);
  var count = dp.initializeCount(queryWords, groupByKeys);
  _.each(data, function(d) {
    var wordFreq = {};
    _.each(queryWords, function(w) {
      wordFreq[dp.wfKeyBuilder(d, w, groupBy)] = parseInt(d['wf_' + w]) || 0;
    });
    count = dp.mergeAndAdd(count, wordFreq);
  });
  var processedData = _.chain(count)
    .map(function(v, k) { return {x_val: k, y_val: v} })
    .sortBy('y_val')
    .reverse()
    .value();

  console.log('Finish processing barchart data at ' + moment().format('HH:mm:ss'));
  console.log(processedData);
  return processedData;
};

DataProcessingUtils.wfKeyBuilder = function(data, word, groupBy) {
  if (groupBy === 'word') {
    return word;
  } else if (groupBy === 'party') {
    return data.party + ' ' + word;
  } else if (groupBy === 'mp_id') {
    return data.mp_id + ' ' + word;
  } else { // general_assembly_id
    return data.general_assembly_id + ' ' + word;
  }
};

DataProcessingUtils.mergeAndAdd = function(obj1, obj2) {
  var merged = $.extend({}, obj1);
  _.each(obj2, function(val, key) {
    merged[key] = merged[key] ? (merged[key] + val) : val;
  });
  return merged;
};

DataProcessingUtils.initializeCount = function(queryWords, keys) {
  var obj = {}
  _.each(queryWords, function(w) {
    _.each(keys, function(k) {
      key = k ? (k + ' ' + w) : w
      obj[key] = 0;
    });
  });
  return obj;
};

DataProcessingUtils.getGroupByKeys = function(data, groupBy) {
  if (groupBy === 'word') {
    return [''];
  } else {
    return _.uniq(_.map(data, function(d) { return d[groupBy] }));
  }
};

module.exports = DataProcessingUtils;