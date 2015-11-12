var React  = require('react/react');
var render = require('ReactBridge/render');

var App = React.createClass({

    render: function () {
        return React.createElement('test-container', { text: 'container' },
            React.createElement('test-child', { text: 'child-1' }),
            React.createElement('test-child', { text: 'child-2' })
        );
    }

});

render(
    React.createElement(App, {})
);
