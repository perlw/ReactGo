var CallbackQueue = require('react/lib/CallbackQueue');
var PooledClass   = require('react/lib/PooledClass');
var Transaction   = require('react/lib/Transaction');

var assign = require('react/lib/Object.assign');

var ON_READY_QUEUEING = {
    initialize: function () {
        this.reactMountReady.reset();
    },
    close: function () {
        this.reactMountReady.notifyAll();
    }
};

function ReconcileTransaction() {
    this.reinitializeTransaction();
    this.reactMountReady = CallbackQueue.getPooled(null);
}

var Mixin = {
    getTransactionWrappers: function () {
        return [ON_READY_QUEUEING];
    },
    getReactMountReady: function () {
        return this.reactMountReady;
    },
    destructor: function () {
        CallbackQueue.release(this.reactMountReady);
        this.reactMountReady = null;
    }
};

assign(
    ReconcileTransaction.prototype,
    Transaction.Mixin,
    Mixin
);

PooledClass.addPoolingTo(ReconcileTransaction);

module.exports = ReconcileTransaction;
