define(function(require) {
    'use strict';

    var AbstractInputWidget;
    var _ = require('underscore');
    var BaseView = require('oroui/js/app/views/base/view');

    AbstractInputWidget = BaseView.extend({
        /** @property {jQuery} */
        $container: null,

        /** @property {Boolean} */
        keepElement: true,

        /** @property {String} */
        widgetFunctionName: '',

        /** @property {Function} */
        widgetFunction: null,

        /** @property {mixed} */
        initializeOptions: null,

        /** @property {mixed} */
        destroyOptions: null,

        /** @property {mixed} */
        refreshOptions: null,

        /** @property {string} */
        containerClass: 'input-widget',

        /** @property {string} */
        containerClassSuffix: '',

        initialize: function(options) {
            this.resolveOptions(options);

            if (this.initializeOptions) {
                this.widgetFunction(this.initializeOptions);
            } else {
                this.widgetFunction();
            }

            this.setContainer();
            this.getContainer().addClass(this.containerClass);
        },

        resolveOptions: function(options) {
            _.extend(this, options || {});

            this.$el.data('inputWidget', this);
            this.widgetFunction = _.bind(this.$el[this.widgetFunctionName], this.$el);

            if (this.containerClassSuffix) {
                this.containerClass += '-' + this.containerClassSuffix;
            }
        },

        dispose: function() {
            if (this.disposed) {
                return;
            }

            this.$el.data('inputWidget', null);

            if (this.destroyOptions) {
                this.widgetFunction(this.destroyOptions);
            }

            return AbstractInputWidget.__super__.dispose.apply(this, arguments);
        },

        setContainer: function() {},

        getContainer: function() {
            return this.$container;
        },

        setWidth: function(width) {
            if (this.getContainer()) {
                this.getContainer().width(width);
            }
        },

        refresh: function() {
            if (this.refreshOptions) {
                this.widgetFunction(this.refreshOptions);
            }
        }
    });

    return AbstractInputWidget;
});
