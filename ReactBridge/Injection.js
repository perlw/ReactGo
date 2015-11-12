var ReactInjection            = require('react/lib/ReactInjection');
var ReactComponentEnvironment = require('react/lib/ReactComponentEnvironment');
var ReconcileTransaction      = require('./ReconcileTransaction');
var Component                 = require('./Component');

var Injection = {

    inject: function () {
        ReactInjection.NativeComponent.injectGenericComponentClass(
            Component
        );

        ReactInjection.Updates.injectReconcileTransaction(
            ReconcileTransaction
        );

        ReactInjection.EmptyComponent.injectEmptyComponent('element');

        // NOTE: we're monkeypatching ReactComponentEnvironment because
        // ReactInjection.Component.injectEnvironment() currently throws,
        // as it's already injected by ReactDOM for backward compat in 0.14 betas.
        // Read more: https://github.com/Yomguithereal/react-blessed/issues/5
        ReactComponentEnvironment.processChildrenUpdates = function () {};
        ReactComponentEnvironment.replaceNodeWithMarkupByID = function () {};
    }

};

module.exports = Injection;
