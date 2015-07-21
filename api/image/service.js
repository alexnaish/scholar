var resemble = require('../lib/resemble.js');

resemble.outputSettings({
    errorColor: {
        red: 250,
        green: 30,
        blue: 30
    },
    errorType: 'movement',
    transparency: 0.8,
    largeImageThreshold: 2100
});

module.exports = {

    compareImages: function (image1, image2, callback) {

        var bufferA = new Buffer(image1, 'base64');
        var bufferB = new Buffer(image2, 'base64');

        resemble(bufferA)
            .compareTo(bufferB)
            .ignoreAntialiasing()
            .ignoreColors()
            .onComplete(function (diffData) {

                var chunks = [];
                var png = diffData.getDiffImage().pack();

                png.on('data', function (chunk) {
                    chunks.push(chunk);
                });

                png.on('end', function () {
                    var result = Buffer.concat(chunks);
                    callback(diffData, result.toString('base64'));
                });
            });
    },
    generateImage: function (res, imageData) {
        res.set('Content-Type', 'image/png');
        var buffer = new Buffer(imageData, 'base64');
        res.status(200).send(buffer);
    }

};