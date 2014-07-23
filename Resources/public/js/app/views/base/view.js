/*jslint nomen:true, eqeq:true*/
/*global define*/
define([
    'jquery',
    'underscore',
    'chaplin'
], function ($, _, Chaplin) {
    'use strict';

    var BaseView;

    BaseView = Chaplin.View.extend({

        getTemplateFunction: function () {
            var template, templateFunc;
            template = this.template;
            templateFunc = null;

            if (typeof template === 'string') {
                templateFunc = _.template(template);
                // share a compiled template with all instances built with same constructor
                this.constructor.prototype.template = templateFunc;
            } else {
                templateFunc = template;
            }

            return templateFunc;
        },

        /**
         * Tries to find element in already declared regions, otherwise calls super _ensureElement method
         *
         * @private
         * @override
         */
        _ensureElement: function () {
            var $el;
            if (this.el && typeof this.el === 'string') {
                $el = this._findRegionElem(this.el);
            }

            if ($el) {
                this.setElement($el, false);
            } else {
                BaseView.__super__._ensureElement.call(this);
            }
        },

        /**
         * Tries to find element by region name
         *
         * @param {string} name
         * @returns {jQuery|undefined}
         * @private
         */
        _findRegionElem: function (name) {
            var $el, region, instance;
            region = Chaplin.mediator.execute('region:find', name);
            if (region != null) {
                instance = region.instance;
                if (instance.container != null) {
                    $el = instance.region != null ? $(instance.container).find(region.selector) : instance.container;
                } else {
                    $el = instance.$(region.selector);
                }
            }
            return $el;
        }
    });

    return BaseView;
});
