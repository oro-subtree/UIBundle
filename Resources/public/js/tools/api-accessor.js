/** @lends ApiAccessor */
define(function(require) {
    'use strict';

    /**
     * Abstraction of api access point. This class is designed to create from server configuration.
     *
     * @class
     * @param {object} options
     * @param {string} options.route - Route name
     * @param {string} options.http_method - Http method to access this route (e.g. GET/POST/PUT/PATCH...)
     *                                     By default `'GET'`.
     * @param {string} options.form_name - Wraps request body into form_name, so request will look like
     *                            `{<form_name>:<request_body>}`
     * @param {object} options.headers - Allows to provide additional http headers
     * @param {object}options.default_route_parameters Provides default parameters values for route creation,
     *                            this defaults will be merged with row model data to get url
     * @param {Array.<string>}options.query_parameter_names - Array of parameter names to put into query string
     *                         (e.g. `?<parameter-name>=<value>&<parameter-name>=<value>`).
     *                         (The reason of adding this argument is that FOSRestBundle doesn’t provides acceptable
     *                         query parameters for client usage, so it is required to specify list of them)
     * @augment StdClass
     * @exports ApiAccessor
     */
    var ApiAccessor;

    var _ = require('underscore');
    var $ = require('jquery');
    var BaseClass = require('../base-class');
    var RouteModel = require('../app/models/route-model');

    ApiAccessor = BaseClass.extend(/** @exports ApiAccessor.prototype */{
        DEFAULT_HEADERS: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        DEFAULT_HTTP_METHOD: 'GET',

        formName: void 0,

        /**
         * @param {object} Options passed to constructor
         */
        initialize: function(options) {
            if (!options) {
                options = {};
            }
            this.initialOptions = options;
            this.httpMethod = options.http_method || this.DEFAULT_HTTP_METHOD;
            this.headers = _.extend({}, this.DEFAULT_HEADERS, options.headers || {});
            this.formName = options.form_name;
            // init route model
            if (!options.route) {
                throw Error('"route" is a required option');
            }
            this.route = new RouteModel(_.extend({}, options.default_route_parameters, {
                routeName: options.route,
                routeQueryParameterNames: options.query_parameter_names
            }));
        },

        /**
         * Prepares request body.
         *
         * @param {object} urlParameters - Url parameters to combine url
         * @param {object} body - Request body
         * @param {object} headers - Headers to send with request
         * @returns {$.Promise} - Promise with abort() support
         */
        send: function(urlParameters, body, headers) {
            return $.ajax({
                headers: this.getHeaders(headers),
                type: this.httpMethod,
                url: this.getUrl(urlParameters),
                data: JSON.stringify(this.formatBody(body))
            });
        },

        /**
         * Prepares headers for request.
         *
         * @param {object} headers - Headers to merge into default list
         * @returns {object}
         */
        getHeaders: function(headers) {
            return _.extend({}, this.headers, headers || {});
        },

        /**
         * Prepares url for request.
         *
         * @param {object} urlParameters - Map of url parameters to use
         * @returns {string}
         */
        getUrl: function(urlParameters) {
            return this.route.getUrl(urlParameters);
        },

        /**
         * Prepares request body.
         *
         * @param {object} body - Map of url parameters to use
         * @returns {object}
         */
        formatBody: function(body) {
            var formattedBody;
            if (this.formName) {
                formattedBody = {};
                formattedBody[this.formName] = body;
            } else {
                formattedBody = body;
            }
            return formattedBody;
        }
    });

    return ApiAccessor;
});
