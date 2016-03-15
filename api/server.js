var app = require('./index');
var cluster = require('cluster');
var port = process.env.PORT || 8080;

if (cluster.isMaster) {
  var numWorkers = require('os').cpus().length;

  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  app.listen(port, function(error) {
    if (error) {
      console.error('Unable to bind to port: ', port, error);
    } else {
      console.log(`Worker ${process.pid} listening on port: ${port}`);
    }
  });
}
