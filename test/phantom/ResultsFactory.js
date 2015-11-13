var builder = require('xmlbuilder');

function getFailureAttrs(data) {
    return {
        type: data.isSameDimensions ? 'Total mismatch' : 'Image mismatch'
    };
}

function getFailureMessage(data, baseUrl) {
    var failureMessage = '';
    if (!data.isSameDimensions) {
        failureMessage += 'Dimensions mismatch';
    }
    if (data.difference) {
        failureMessage += ' Image mismatch of ' + data.difference + '%';
    }
    failureMessage += '\n' + baseUrl + data.diffUrl + '\n';
    return failureMessage;
}

function JunitXML(baseUrl) {
    this.xmlObj = builder.create('testsuite');
    this.baseUrl = baseUrl;
    return this;
}

JunitXML.prototype = {
    createPassingTestResult: function (name) {
        this.xmlObj.ele('testcase', {name: name});
        return this;
    },
    createFailingTestResult: function (name, response, error) {
        if (response) {
            var xmlEle = this.xmlObj.ele('testcase', {name: name});
            xmlEle.ele('failure', getFailureAttrs(response), getFailureMessage(response, this.baseUrl));
        } else {
            console.error('Failed with ', JSON.stringify(error));
        }
    },
    createTotalAttrs: function (totalTests, failedTests) {
        this.xmlObj.att('tests', totalTests);
        this.xmlObj.att('failures', failedTests);
    },
    end: function () {
        return this.xmlObj.end({pretty: true});
    }
};
module.exports = {
    createRoot: function (baseUrl) {
        return new JunitXML(baseUrl);
    }
};