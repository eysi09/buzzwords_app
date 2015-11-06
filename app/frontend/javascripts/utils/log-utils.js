var moment = require('moment');

var LogUtils = {};

var ActiveLogProcesses = {};

LogUtils.startLog = function(id, name) {
  var m = moment();
  ActiveLogProcesses[id] = {moment: m, name: name};
  console.log('Started ' + name + ' at ' + m.format('HH:mm:ss:SS'));
},

LogUtils.endLog = function(id) {
  var logProcess = ActiveLogProcesses[id];
  if (logProcess) {
    console.log('Finished ' + logProcess.name + ' at ' + logProcess.moment.format('HH:mm:ss:SS'));
    console.log('Duration: ' + moment().diff(logProcess.moment) + ' ms');
  }
},

module.exports = LogUtils;