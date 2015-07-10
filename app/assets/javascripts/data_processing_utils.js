var DataProcessingUtils = (function() {

  var exports = {};

  exports.wfKeyBuilder = function(data, word, splitBy) {
    if (splitBy === 'words') {
      return word;
    } else if (splitBy === 'parties') {
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

  exports.getSplitByKeys = function(data, splitBy) {
    if (splitBy === 'words') {
      return [''];
    } else {
      var key = splitBy === 'parties' ? 'party' : 'mp_id';
      return _.uniq(_.map(data, function(d) { return d[key] }));
    }
  };

  return exports;
  
})();