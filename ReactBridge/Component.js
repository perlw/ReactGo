var ReactBridge     = require('./ReactBridge');
var assign          = require('react/lib/Object.assign');
var ReactMultiChild = require('react/lib/ReactMultiChild');

function Component() {
    this._currentElement   = null;
    this._renderedChildren = null;
    this._rootNodeID       = null;
}

assign(Component.prototype, ReactMultiChild.Mixin, {
    construct: function (initialElement) {
        this._currentElement = initialElement;
    },

    mountComponent: function (id, transaction, context) {
        this._rootNodeID = id;

        var widgetType = this._currentElement.type;
        widgetType = widgetType[0].toUpperCase() + widgetType.slice(1);
        ReactBridge.sendCommand({
            command: 'create',
            key    : id,
            type   : widgetType
        });

        if (this._currentElement.props.children) {
            this.mountChildren(this._currentElement.props.children, transaction, context);
        }

        this.receiveComponent(this._currentElement, transaction, context);
    },

    receiveComponent: function (nextElement, transaction, context) {
        var props = assign({}, nextElement.props);
        // Don't send children.
        delete props.children;

        ReactBridge.sendCommand({
            command   : 'configure',
            key       : this._rootNodeID,
            properties: props
        });

        if (nextElement.props.children) {
            this.updateChildren(nextElement.props.children, transaction, context);
        }
    },

    unmountComponent: function () {
        this.unmountChildren();

        ReactBridge.sendCommand({
            command: 'delete',
            key    : this._rootNodeID
        });
    },

    getPublicInstance: function () {
        return this;
    }

});

module.exports = Component;
