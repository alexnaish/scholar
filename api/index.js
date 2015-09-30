var config = require('config'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    router = require('./router'),
    port = process.env.PORT || 8080;

module.exports = app;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connection established');
});

mongoose.connect("mongodb://" + config.mongo.user + ":" + config.mongo.pass + "@" + config.mongo.host + "/" + config.mongo.db);

app.use(express.static(__dirname + '/../public'));

app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: false
}));
app.use(morgan('dev', {
    skip: function (req) {
        return req.url === '/favicon.ico';
    }
}));
app.disable('x-powered-by');

process.on('uncaughtException', function(error){
    console.error('Uncaught Error: ', error);
});

router.apply(app);
app.get('/api/config', function (req, res) {
    res.json(config);
});
app.get('*', function (req, res) {
    res.status(404).send('Scholar Fallback 404');
    res.end();
});

app.listen(port, function (error) {
    if (error) {
        console.error('Unable to bind to port: ', port, error);
    } else {
        console.log('listening on port: ', port);
    }
});
