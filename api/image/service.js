var scholarCompare = require('scholar-comparison');

module.exports = {

    compareImages: function (image1, image2, callback) {
        var bufferA = new Buffer(image1, 'base64');
        var bufferB = new Buffer(image2, 'base64');

        scholarCompare(bufferA, bufferB, (err, diffData) => {
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
        if(!imageData) {
            return res.status(404).send();
        }
        res.set('Content-Type', 'image/png');
        var buffer = new Buffer(imageData, 'base64');
        res.status(200).send(buffer);
    }

};
