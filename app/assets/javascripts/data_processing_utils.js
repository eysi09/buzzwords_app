var DataProcessingUtils = (function() {

  var exports = {};

  exports.wfKeyBuilder = function(data, word, groupBy) {
    if (groupBy === 'word') {
      return word;
    } else if (groupBy === 'party') {
      return data.party + ' ' + word;
    } else { // mp
      return data.mp_id + ' ' + word;
    }
  };

  exports.mergeAndAdd = function(obj1, obj2) {
    var merged = $.extend({}, obj1);
    _.each(obj2, function(val, key) {
      merged[key] = merged[key] ? (merged[key] + val) : val;
    });
    return merged;
  };

  exports.initializeCount = function(queryWords, keys) {
    var obj = {}
    _.each(queryWords, function(w) {
      _.each(keys, function(k) {
        key = k ? (k + ' ' + w) : w
        obj[key] = 0;
      });
    });
    return obj;
  };

  exports.getGroupByKeys = function(data, groupBy) {
    if (groupBy === 'word') {
      return [''];
    } else {
      return _.uniq(_.map(data, function(d) { return d[groupBy] }));
    }
  };

  return exports;
  
})();