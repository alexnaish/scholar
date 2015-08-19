'use strict';

var PNG = require('pngjs').PNG;
var fs = require('fs');

var _this = {};

var pixelTransparency = 1;
var errorPixelColour = {
    alpha: 255
};
var largeImageThreshold = 1280;

var errorPixelTransformer = function (d1, d2) {
    return {
        r: ((d2.r * (errorPixelColour.red / 255)) + errorPixelColour.red) / 2,
        g: ((d2.g * (errorPixelColour.green / 255)) + errorPixelColour.green) / 2,
        b: ((d2.b * (errorPixelColour.blue / 255)) + errorPixelColour.blue) / 2,
        a: d2.a
    };
};

_this.resemble = function (fileData) {

    var data = {};
    var images = [];
    var updateCallbackArray = [];

    var tolerance = { // between 0 and 255
        red: 16,
        green: 16,
        blue: 16,
        alpha: 16,
        minBrightness: 16,
        maxBrightness: 240
    };

    var ignoreAntialiasing = false;
    var ignoreColors = false;
    var ignoreRectangles = null;

    function triggerDataUpdate() {
        var len = updateCallbackArray.length;
        var i;
        for (i = 0; i < len; i++) {
            if (typeof updateCallbackArray[i] === 'function') {
                updateCallbackArray[i](data);
            }
        }
    }

    function loop(x, y, callback) {
        var i, j;

        for (i = 0; i < x; i++) {
            for (j = 0; j < y; j++) {
                callback(i, j);
            }
        }
    }

    function parseImage(sourceImageData, width, height) {

        var pixleCount = 0;
        var redTotal = 0;
        var greenTotal = 0;
        var blueTotal = 0;
        var brightnessTotal = 0;

        loop(height, width, function (verticalPos, horizontalPos) {
            var offset = (verticalPos * width + horizontalPos) * 4;
            var red = sourceImageData[offset];
            var green = sourceImageData[offset + 1];
            var blue = sourceImageData[offset + 2];
            var brightness = getBrightness(red, green, blue);

            pixleCount++;

            redTotal += red / 255 * 100;
            greenTotal += green / 255 * 100;
            blueTotal += blue / 255 * 100;
            brightnessTotal += brightness / 255 * 100;
        });

        data.red = Math.floor(redTotal / pixleCount);
        data.green = Math.floor(greenTotal / pixleCount);
        data.blue = Math.floor(blueTotal / pixleCount);
        data.brightness = Math.floor(brightnessTotal / pixleCount);

        triggerDataUpdate();
    }

    function loadImageData(fileData, callback) {
        var png = new PNG({
            filterType: 4
        });
        if (Buffer.isBuffer(fileData)) {
            png.parse(fileData, function (err, data) {
                callback(data, data.width, data.height);
            });
        } else {
            fs.createReadStream(fileData)
                .pipe(png)
                .on('parsed', function () {
                    callback(this, this.width, this.height);
                });
        }
    }

    function isColorSimilar(a, b, color) {

        var absDiff = Math.abs(a - b);

        if (typeof a === 'undefined') {
            return false;
        }
        if (typeof b === 'undefined') {
            return false;
        }

        if (a === b) {
            return true;
        } else if (absDiff < tolerance[color]) {
            return true;
        } else {
            return false;
        }
    }

    function isPixelBrightnessSimilar(d1, d2) {
        var alpha = isColorSimilar(d1.a, d2.a, 'alpha');
        var brightness = isColorSimilar(d1.brightness, d2.brightness, 'minBrightness');
        return brightness && alpha;
    }

    function getBrightness(r, g, b) {
        return 0.3 * r + 0.59 * g + 0.11 * b;
    }

    function isRGBSame(d1, d2) {
        var red = d1.r === d2.r;
        var green = d1.g === d2.g;
        var blue = d1.b === d2.b;
        return red && green && blue;
    }

    function isRGBSimilar(d1, d2) {
        var red = isColorSimilar(d1.r, d2.r, 'red');
        var green = isColorSimilar(d1.g, d2.g, 'green');
        var blue = isColorSimilar(d1.b, d2.b, 'blue');
        var alpha = isColorSimilar(d1.a, d2.a, 'alpha');

        return red && green && blue && alpha;
    }

    function isContrasting(d1, d2) {
        return Math.abs(d1.brightness - d2.brightness) > tolerance.maxBrightness;
    }

    function getHue(r, g, b) {

        r = r / 255;
        g = g / 255;
        b = b / 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h;
        var d;

        if (max === min) {
            h = 0; // achromatic
        } else {
            d = max - min;
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }

        return h;
    }

    function isAntialiased(sourcePix, data, cacheSet, verticalPos, horizontalPos, width) {
        var offset;
        var targetPix;
        var distance = 1;
        var i;
        var j;
        var hasHighContrastSibling = 0;
        var hasSiblingWithDifferentHue = 0;
        var hasEquivilantSibling = 0;

        addHueInfo(sourcePix);

        for (i = distance * -1; i <= distance; i++) {
            for (j = distance * -1; j <= distance; j++) {

                if (!(i === 0 && j === 0)) {

                    offset = ((verticalPos + j) * width + (horizontalPos + i)) * 4;
                    targetPix = getPixelInfo(data, offset, cacheSet);

                    if (targetPix === null) {
                        continue;
                    }

                    addBrightnessInfo(targetPix);
                    addHueInfo(targetPix);

                    if (isContrasting(sourcePix, targetPix)) {
                        hasHighContrastSibling++;
                    }

                    if (isRGBSame(sourcePix, targetPix)) {
                        hasEquivilantSibling++;
                    }

                    if (Math.abs(targetPix.h - sourcePix.h) > 0.3) {
                        hasSiblingWithDifferentHue++;
                    }

                    if (hasSiblingWithDifferentHue > 1 || hasHighContrastSibling > 1) {
                        return true;
                    }
                }
            }
        }

        if (hasEquivilantSibling < 2) {
            return true;
        }

        return false;
    }

    function setPixel(pixelArray, index, colour) {
        pixelArray[index] = colour.red;
        pixelArray[index + 1] = colour.green;
        pixelArray[index + 2] = colour.blue;
        pixelArray[index + 3] = colour.alpha * pixelTransparency;
    }

    function createColourObject(red, blue, green, alpha) {
        return {
            red: red,
            green: green,
            blue: blue,
            alpha: alpha
        };
    }

    function errorPixel(px, offset, data1, data2) {
        var data = errorPixelTransformer(data1, data2);
        var colour = createColourObject(data.r, data.g, data.b, data.a);
        setPixel(px, offset, colour);
    }

    function copyPixel(px, offset, data) {
        var colour = createColourObject(data.r, data.g, data.b, data.a * pixelTransparency);
        setPixel(px, offset, colour);
    }

    function copyGrayScalePixel(px, offset, data) {
        var colour = createColourObject(data.brightness, data.brightness, data.brightness, data.a * pixelTransparency);
        setPixel(px, offset, colour);
    }

    function getPixelInfo(data, offset) {
        var r;
        var g;
        var b;
        var d;
        var a;

        r = data[offset];

        if (typeof r !== 'undefined') {
            g = data[offset + 1];
            b = data[offset + 2];
            a = data[offset + 3];
            d = {
                r: r,
                g: g,
                b: b,
                a: a
            };

            return d;
        } else {
            return null;
        }
    }

    function addBrightnessInfo(data) {
        data.brightness = getBrightness(data.r, data.g, data.b); // 'corrected' lightness
    }

    function addHueInfo(data) {
        data.h = getHue(data.r, data.g, data.b);
    }

    function analyseImages(img1, img2, width, height) {

        var data1 = img1.data;
        var data2 = img2.data;

        //TODO
        var imgd = new PNG({
            width: img1.width,
            height: img1.height,
            deflateChunkSize: img1.deflateChunkSize,
            deflateLevel: img1.deflateLevel,
            deflateStrategy: img1.deflateStrategy,
        });
        var targetPix = imgd.data;

        var mismatchCount = 0;

        var time = Date.now();

        var skip;

        var currentRectangle = null;
        var rectagnlesIdx = 0;

        if ((width > largeImageThreshold || height > largeImageThreshold) && ignoreAntialiasing) {
            skip = 6;
        }

        loop(height, width, function (verticalPos, horizontalPos) {

            if (skip) { // only skip if the image isn't small
                if (verticalPos % skip === 0 || horizontalPos % skip === 0) {
                    return;
                }
            }

            var offset = (verticalPos * width + horizontalPos) * 4;
            var pixel1 = getPixelInfo(data1, offset, 1);
            var pixel2 = getPixelInfo(data2, offset, 2);

            if (pixel1 === null || pixel2 === null) {
                return;
            }

            if (ignoreRectangles) {
                for (rectagnlesIdx = 0; rectagnlesIdx < ignoreRectangles.length; rectagnlesIdx++) {
                    currentRectangle = ignoreRectangles[rectagnlesIdx];
                    //console.log(currentRectangle, verticalPos, horizontalPos);
                    if (
                        (verticalPos >= currentRectangle[1]) &&
                        (verticalPos < currentRectangle[1] + currentRectangle[3]) &&
                        (horizontalPos >= currentRectangle[0]) &&
                        (horizontalPos < currentRectangle[0] + currentRectangle[2])
                    ) {
                        copyGrayScalePixel(targetPix, offset, pixel2);
                        //copyPixel(targetPix, offset, pixel1, pixel2);
                        return;
                    }
                }
            }

            if (ignoreColors) {

                addBrightnessInfo(pixel1);
                addBrightnessInfo(pixel2);

                if (isPixelBrightnessSimilar(pixel1, pixel2)) {
                    copyGrayScalePixel(targetPix, offset, pixel2);
                } else {
                    errorPixel(targetPix, offset, pixel1, pixel2);
                    mismatchCount++;
                }
                return;
            }

            if (isRGBSimilar(pixel1, pixel2)) {
                copyPixel(targetPix, offset, pixel1, pixel2);

            } else if (ignoreAntialiasing && (
                    addBrightnessInfo(pixel1), // jit pixel info augmentation looks a little weird, sorry.
                    addBrightnessInfo(pixel2),
                    isAntialiased(pixel1, data1, 1, verticalPos, horizontalPos, width) ||
                    isAntialiased(pixel2, data2, 2, verticalPos, horizontalPos, width)
                )) {

                if (isPixelBrightnessSimilar(pixel1, pixel2)) {
                    copyGrayScalePixel(targetPix, offset, pixel2);
                } else {
                    errorPixel(targetPix, offset, pixel1, pixel2);
                    mismatchCount++;
                }
            } else {
                errorPixel(targetPix, offset, pixel1, pixel2);
                mismatchCount++;
            }

        });

        data.misMatchPercentage = (mismatchCount / (height * width) * 100).toFixed(2);
        data.analysisTime = Date.now() - time;

        data.getDiffImage = function () {
            return imgd;
        };
    }

    function compare(one, two) {

        function onceWeHaveBoth(img) {
            var width;
            var height;

            images.push(img);
            if (images.length === 2) {
                width = images[0].width > images[1].width ? images[0].width : images[1].width;
                height = images[0].height > images[1].height ? images[0].height : images[1].height;

                if ((images[0].width === images[1].width) && (images[0].height === images[1].height)) {
                    data.isSameDimensions = true;
                } else {
                    data.isSameDimensions = false;
                }

                data.dimensionDifference = {
                    width: images[0].width - images[1].width,
                    height: images[0].height - images[1].height
                };

                //lksv: normalization removed
                analyseImages(images[0], images[1], width, height);

                triggerDataUpdate();
            }
        }

        images = [];
        loadImageData(one, onceWeHaveBoth);
        loadImageData(two, onceWeHaveBoth);
    }

    function getCompareApi(param) {

        var secondFileData,
            hasMethod = typeof param === 'function';

        if (!hasMethod) {
            // assume it's file data
            secondFileData = param;
        }

        var self = {
            ignoreAntialiasing: function () {

                tolerance.red = 32;
                tolerance.green = 32;
                tolerance.blue = 32;
                tolerance.alpha = 32;
                tolerance.minBrightness = 64;
                tolerance.maxBrightness = 96;

                ignoreAntialiasing = true;
                ignoreColors = false;

                if (hasMethod) {
                    param();
                }
                return self;
            },
            ignoreColors: function () {

                tolerance.alpha = 16;
                tolerance.minBrightness = 16;
                tolerance.maxBrightness = 240;

                ignoreAntialiasing = false;
                ignoreColors = true;

                if (hasMethod) {
                    param();
                }
                return self;
            },
            onComplete: function (callback) {

                updateCallbackArray.push(callback);

                var wrapper = function () {
                    compare(fileData, secondFileData);
                };

                wrapper();

                return getCompareApi(wrapper);
            }
        };

        return self;
    }

    return {
        onComplete: function (callback) {
            updateCallbackArray.push(callback);
            loadImageData(fileData, function (imageData, width, height) {
                parseImage(imageData.data, width, height);
            });
        },
        compareTo: function (secondFileData) {
            return getCompareApi(secondFileData);
        }
    };

};

_this.resemble.setErrorRgbColour = function (redValue, greenValue, blueValue) {
    errorPixelColour.red = redValue || 200;
    errorPixelColour.green = greenValue || 50;
    errorPixelColour.blue = blueValue || 50;
};
_this.resemble.setErrorOpacity = function (value) {
    pixelTransparency = value || 0.95;
};
_this.resemble.setLargeImageThreshold = function (value) {
    largeImageThreshold = value || 1280;
};

module.exports = _this.resemble;