var image = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABIUlEQVR42u3YPQ6CQBAFYI7gETyCR/AIHsGKFls6Q01tiy2dCRewosWWzoSWwooWM5sM2RALw4/sw7fJJmg1X2ZnlsFrV7I8QgghhBBC/hLSNK/2cjmYLc+QEAk8inat73tmx/EeE6KIINh0GDhInl+74KvqgQsJw60JPEmO5jckxM5GXT8xIZIBDVqzAQnRgKXANRvQkG//J4SQNUHsjjR0OwHRS+4X227dzhytIZmU9u0cRDNZlnfcYpdLcWx9OAHR964xs4gTEK2PLDtjQ6aoj8UhOlD1OxAERDKggafp6eOdADez67EqihsuxJ4Sob9r9Wd2WEh/ZoeEyIe5KY/VYhC5xadqu4tCtAXLPQINmWMRQgghhBBCCCGEEDLfegN6BJlsjQsKMgAAAABJRU5ErkJggg==';

module.exports = {

    submitNewScreenshot: function (req, res) {

        res.status(200).send('woooo');

    },

    listByName: function (req, res) {

    },

    renderRawImage: function (req, res) {


        res.set('Content-Type', 'image/png');
        var buffer = new Buffer(image, 'base64');
        res.status(200).send(buffer);
    }

};