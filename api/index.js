var config = require('config'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    router = require('./router');

module.exports = app;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connection established');
});

mongoose.connect("mongodb://" + config.mongo.user + ":" + config.mongo.pass + "@" + config.mongo.host + "/" + config.mongo.db);

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: false
}));

if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev', {
      skip: function (req) {
          return req.url === '/favicon.ico';
      }
  }));
}

app.disable('x-powered-by');

process.on('uncaughtException', function(error){
    console.error('Uncaught Error: ', error);
});

router.apply(app);
app.get('/api/config', function (req, res) {
    res.json(config);
});
app.get('*', function (req, res) {
    res.status(404).json({
        error: 'Scholar API 404 Fallback'
    });
});
app.use(function(err, req, res, next) {
  console.error('Error:', err.stack);
  res.status(500).json({error: 'Internal Server Error'});
});
