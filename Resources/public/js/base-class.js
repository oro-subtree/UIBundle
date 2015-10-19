/** @lends StdClass */
define(function(require) {
    'use strict';

    var _ = require('underscore');
    var Backbone = require('backbone');
    var Chaplin = require('chaplin');

    /**
     * Base class that implement extending in backbone way.
     * Also connects events API by default
     *
     * @class
     * @exports StdClass
     */
    var BaseClass = function() {
        this.initialize.apply(this, arguments);
    };

    BaseClass.prototype = {
        initialize: function(options) {
            if (options.listen) {
                this.on(options.listen);
            }
            this.delegateListeners();
        },
        dispose: function() {
            this.stopListening();
            delete this._events;
        }
    };

    _.extend(BaseClass.prototype, Backbone.Events, {
        constructor: BaseClass,
        delegateListeners: Chaplin.View.prototype.delegateListeners,
        delegateListener: Chaplin.View.prototype.delegateListener
    });

    BaseClass.extend = Backbone.Model.extend;

    return BaseClass;
});
