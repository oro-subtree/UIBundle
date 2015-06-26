/*jslint nomen:true*/
/*global define*/
define([
    'underscore',
    'backbone',
    'oroui/js/app/components/base/component-container-mixin'
], function(_, Backbone, componentContainerMixin) {
    'use strict';

    _.extend(Backbone.View.prototype, componentContainerMixin);
    Backbone.View.prototype.disposed = false;
    Backbone.View.prototype.dispose = function() {
        var prop, properties, subview, _i, _j, _len, _len1, _ref;
        if (this.disposed) {
            return;
        }

        this.disposePageComponents();
        this.trigger('dispose', this);

        _ref = _.toArray(this.subviews);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            subview = _ref[_i];
            subview.dispose();
        }
        Backbone.mediator.unsubscribe(null, null, this);
        this.off();
        this.stopListening();
        if (this.$el) {
            this.undelegateEvents();
            this.$el.removeData();
        }

        properties = ['el', '$el', 'options', 'model', 'collection', 'subviews', 'subviewsByName', '_callbacks'];
        for (_j = 0, _len1 = properties.length; _j < _len1; _j++) {
            prop = properties[_j];
            delete this[prop];
        }

        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };
    Backbone.View.prototype.eventNamespace = function() {
        return '.delegateEvents' + this.cid;
    };
    Backbone.View.prototype.getLayoutElement = function() {
        return this.$el;
    };
    Backbone.View.prototype.initLayout = function() {
        // initializes layout
        Backbone.mediator.execute('layout:init', this.getLayoutElement());
        // initializes page components
        return this.initPageComponents();
    };

    Backbone.Model.prototype.disposed = false;
    Backbone.Model.prototype.dispose = function() {
        var prop, properties, _i, _len;
        if (this.disposed) {
            return;
        }
        this.trigger('dispose', this);
        Backbone.mediator.unsubscribe(null, null, this);
        this.stopListening();
        this.off();
        properties = ['collection', 'attributes', 'changed', '_escapedAttributes', '_previousAttributes', '_silent', '_pending', '_callbacks'];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
            prop = properties[_i];
            delete this[prop];
        }
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Backbone.Collection.prototype.disposed = false;
    Backbone.Collection.prototype.dispose = function() {
        var prop, properties, _i, _len;
        if (this.disposed) {
            return;
        }
        this.trigger('dispose', this);
        this.reset([], {
            silent: true
        });
        Backbone.mediator.unsubscribe(null, null, this);
        this.stopListening();
        this.off();
        properties = ['model', 'models', '_byId', '_byCid', '_callbacks'];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
            prop = properties[_i];
            delete this[prop];
        }
        this.disposed = true;
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Backbone;
});
