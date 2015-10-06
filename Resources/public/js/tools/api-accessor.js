/** @lends ApiAccessor */
define(function(require) {
    'use strict';

    /**
     * Abstraction of api access point. This class is designed to create from server configuration.
     *
     * #### Sample usage of api_accessor with full options provided.
     * Example configuration is provided on server:
     * ``` yml
     * save_api_accessor:
     *     route: orocrm_opportunity_task_update # for example this route uses following mask
     *                         # to generate url /api/opportunity/{opportunity_id}/tasks/{id}
     *     http_method: POST
     *     headers:
     *         Api-Secret: ANS2DFN33KASD4F6OEV7M8
     *     default_route_parameters:
     *         opportunity_id: 23
     *     action: patch
     *     query_parameter_names: [action]
     * ```
     *
     * Then following code on client:
     * ``` javascript
     * var apiAP = new ApiAccessror(serverConfiguration);
     * apiAP.send({id: 321}, {name: 'new name'}).then(function(result) {
     *     console.log(result)
     * })
     * ```
     * Will raise POST request to `/api/opportunity/23/tasks/321?action=patch` with body == `{name: 'new name'}`
     * and will put response to console after it will be finished
     *
     * @class
     * @param {Object} options - Options container.
     * @param {string} options.route - Required. Route name
     * @param {string} options.http_method - Http method to access this route (e.g. GET/POST/PUT/PATCH...)
     *                          By default `'GET'`.
     * @param {string} options.form_name - Optional. Wraps request body into form_name, so request will look like
     *                          `{<form_name>:<request_body>}`
     * @param {Object} options.headers - Optional. Allows to provide additional http headers
     * @param {Object} options.default_route_parameters - Optional. Provides default parameters values for route
     *                          creation, this defaults will be merged with row model data to get url
     * @param {Array.<string>} options.query_parameter_names - Optional. Array of parameter names to put into query
     *                          string(e.g. `?<parameter-name>=<value>&<parameter-name>=<value>`).
     *                          (The reason of adding this argument is that FOSRestBundle doesn’t provides acceptable
     *                          query parameters for client usage, so it is required to specify list of them)
     * @augment BaseClass
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
         * @param {Object} Options passed to constructor
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
         * Sends request to server and returns $.Promise with abort() support
         *
         * @param {Object} urlParameters - Url parameters to combine url
         * @param {Object} body - Request body
         * @param {Object} headers - Headers to send with request
         * @returns {$.Promise} - Promise with abort() support
         */
        send: function(urlParameters, body, headers) {
            var promise = $.ajax({
                headers: this.getHeaders(headers),
                type: this.httpMethod,
                url: this.getUrl(urlParameters),
                data: JSON.stringify(this.formatBody(body))
            });
            var resultPromise = promise.then(_.bind(this.formatResult, this));
            resultPromise.abort = _.bind(promise.abort, promise);
            return resultPromise;
        },

        /**
         * Prepares headers for request.
         *
         * @param {Object} headers - Headers to merge into default list
         * @returns {Object}
         */
        getHeaders: function(headers) {
            return _.extend({}, this.headers, headers || {});
        },

        /**
         * Prepares url parameters before build url
         *
         * @param urlParameters
         * @returns {Object}
         */
        prepareUrlParameters: function(urlParameters) {
            return urlParameters;
        },

        /**
         * Prepares url for request.
         *
         * @param {Object} urlParameters - Map of url parameters to use
         * @returns {string}
         */
        getUrl: function(urlParameters) {
            return this.route.getUrl(this.prepareUrlParameters(urlParameters));
        },

        /**
         * Prepares request body.
         *
         * @param {Object} body - Map of url parameters to use
         * @returns {Object}
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
        },

        /**
         * Formats response before it will be sent out from this api accessor.
         *
         * @param {Object} response
         * @returns {Object}
         */
        formatResult: function(response) {
            return response;
        }
    });

    return ApiAccessor;
});
