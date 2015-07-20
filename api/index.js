var config = require('config'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    router = require('./router'),
    port = process.env.PORT || 8000;

module.exports = app;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('database connection established');
});

app.use(express.static(__dirname + '/../public'));

app.use(bodyParser.raw());
app.use(morgan('dev', {
    skip: function (req, res) {
        return req.url === '/favicon.ico'
    }
}));
app.disable('x-powered-by');

router.apply(app);
app.get('/config', function (req, res, next) {
    res.json(config);
});
app.get('*', function (req, res, next) {
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