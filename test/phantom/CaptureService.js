function generateCaptureLogMessage(targetFile, clipRect) {
    var logMessage = 'Capturing page to ' + targetFile;
    if (clipRect) {
        logMessage += ' with dimensions: ' + clipRect.width + 'x' + clipRect.height;
    }
    console.log(logMessage);
}


function capture(page, targetFile, clipRect) {

    if (clipRect && clipRect.top === undefined) {
        throw new Error('clipRect must be an Object instance.');
    }

    generateCaptureLogMessage(targetFile, clipRect);
    page.clipRect = clipRect;
    try {
        page.render(targetFile);
    } catch (e) {
        console.error('Failed to capture screenshot as ' + targetFile + ': ' + e);
    }
}

module.exports = {

    captureSelector: function (page, targetFile, selector) {
        var offset = page.evaluate(function (selector) {
            try {
                var clipRect = document.querySelector(selector).getBoundingClientRect();
                return {
                    top: clipRect.top,
                    left: clipRect.left,
                    width: clipRect.width,
                    height: clipRect.height
                };
            } catch (e) {
                console.error('Unable to fetch bounds for element ' + selector);
            }
        }, selector);

        return capture(page, targetFile, offset);
    }

};