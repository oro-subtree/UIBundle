/*jslint nomen:true*/
/*global define*/
define([
    'underscore',
    './base/model'
], function (_, BaseModel) {
    'use strict';

    var PageModel = BaseModel.extend({
        defaults: {
            content: '',

            title: '',
            titleSerialized: '',
            titleShort: '',

            scripts: '',
            mainMenu: '',
            userMenu: '',
            breadcrumb: '',
            flashMessages: [],
            history: '',
            mostviewed: '',
            showPinButton: false
        },

        /**
         * Fetches data from server
         *  - extends options with required parameters
         *
         * @param {Object=} options
         * @override
         */
        fetch: function (options) {
            options = _.defaults(options || {}, {
                accepts: {
                    // @TODO refactor server side action point to accept 'application/json'
                    "json": "*/*"
                },
                headers: {
                    // @TODO discuss if this header is still necessary
                    'x-oro-hash-navigation': 'true'
                }
            });
            BaseModel.prototype.fetch.call(this, options);
        },

        /**
         * Handles response data
         *
         * @param {*} resp
         * @param {Object} options
         * @returns {Object}
         * @override
         */
        parse: function (resp, options) {
            // @TODO handle response data in case error message in response
            return resp;
        },

        /**
         * Validate attribute
         *  - on redirect attribute existed - triggers invalid message with redirect options
         *
         * @param {Object} attrs
         * @param {Object} options
         * @returns {Object|undefined}
         * @override
         */
        validate: function (attrs, options) {
            var result;
            if (attrs.redirect) {
                result = _.pick(attrs, ['redirect', 'fullRedirect', 'location']);
            }
            return result;
        }
    });

    return PageModel;
});
