Go.getCommandFunc(function () {
    print('Got call from Go');
});

var ReactBridge = {

    sendCommand: function (command) {
        Go.sendCommand(JSON.stringify(command));
    }

};

module.exports = ReactBridge;
