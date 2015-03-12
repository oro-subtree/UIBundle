define(function (require) {
    'use strict';

    var DatePickerView,
        $ = require('jquery'),
        _ = require('underscore'),
        moment = require('moment'),
        datetimeFormatter = require('orolocale/js/formatter/datetime'),
        BaseView = require('oroui/js/app/views/base/view'),
        localeSettings  = require('orolocale/js/locale-settings');
    require('jquery-ui');

    DatePickerView = BaseView.extend({
        defaults: {
            dateInputAttrs: {},
            datePickerOptions: {}
        },

        events: {
            change: 'updateFront'
        },

        /**
         * Use native pickers of proper HTML-inputs
         */
        nativeMode: false,

        /**
         * Format of date that native date input accepts
         */
        nativeDateFormat: 'YYYY-MM-DD',

        /**
         * Format of date/datetime that original input accepts
         */
        backendFormat: datetimeFormatter.backendFormats.date,

        /**
         * Initializes view
         *  - creates front field
         *  - updates front field
         *  - initializes picker widget
         *
         * @param {Object} options
         */
        initialize: function (options) {
            var opts = {};
            $.extend(true, opts, this.defaults, options);
            $.extend(this, _.pick(opts, ['nativeMode']));

            this.createFrontField(opts);

            this.$el.wrap('<span style="display:none"></span>');
            if (this.$el.val() && this.$el.val().length) {
                this.updateFront();
            }

            if (!this.nativeMode) {
                this.initPickerWidget(opts);
            }

            DatePickerView.__super__.initialize.apply(this, arguments);
        },

        /**
         * Cleans up HTML
         *  - destroys picker widget
         *  - removes front field
         *  - unwrap original field
         *
         * @override
         */
        dispose: function () {
            if (this.disposed) {
                return;
            }
            if (!this.nativeMode) {
                this.destroyPickerWidget();
            }
            this.$frontDateField.off().remove();
            this.$el.unwrap();
            DatePickerView.__super__.initialize.apply(this, arguments);
        },

        /**
         * Sets value directly to backend field
         *
         * @param {string} value
         */
        setValue: function (value) {
            this.$el.val(value).trigger('change');
        },

        /**
         * Creates frontend field
         *
         * @param {Object} options
         */
        createFrontField: function (options) {
            this.$frontDateField = $('<input />');
            options.dateInputAttrs.type = this.nativeMode ? 'date' : 'text';
            this.$frontDateField.attr(options.dateInputAttrs);
            this.$frontDateField.on('keyup change', _.bind(this.updateOrigin, this));
            this.$el.after(this.$frontDateField);
        },

        /**
         * Initializes date picker widget
         * 
         * @param {Object} options
         */
        initPickerWidget: function (options) {
            var widgetOptions = options.datePickerOptions;
            _.extend(widgetOptions, {
                onSelect: _.bind(this.onSelect, this)
            });
            this.$frontDateField.datepicker(widgetOptions);
        },

        /**
         * Destroys picker widget
         */
        destroyPickerWidget: function () {
            this.$frontDateField.datepicker('destroy');
        },

        /**
         * Handles pick date event
         */
        onSelect: function () {
            var form = this.$frontDateField.parents('form');
            if (form.length && form.data('validator')) {
                form.validate()
                    .element(this.$frontDateField);
            }
            this.$frontDateField.trigger('change');
        },

        /**
         * Updates original field on front field change
         *
         * @param {jQuery.Event} e
         */
        updateOrigin: function (e) {
            this.$el.val(this.getBackendFormattedValue());
            this.$el.trigger('change');
        },

        /**
         * Update front date field value
         */
        updateFront: function () {
            this.$frontDateField.val(this.getFrontendFormattedDate());
        },

        /**
         * Reads value of front field and converts it to backend format
         *
         * @returns {string}
         */
        getBackendFormattedValue: function () {
            var value = '',
                momentInstance = this.getFrontendMoment(),
                format = _.isArray(this.backendFormat) ? this.backendFormat[0] : this.backendFormat;
            if (momentInstance) {
                value = momentInstance.format(format);
            }
            return value;
        },

        /**
         * Reads value of original field and converts it to frontend format
         *
         * @returns {string}
         */
        getFrontendFormattedDate: function () {
            var value = '',
                momentInstance = this.getOriginalMoment();
            if (momentInstance) {
                value = momentInstance.format(this.getDateFormat());
            }
            return value;
        },

        /**
         * Creates moment object for original field
         *
         * @returns {moment}
         */
        getOriginalMoment: function () {
            var value, format, momentInstance;
            value = this.$el.val();
            format = this.backendFormat;
            momentInstance = moment.utc(value, format, true);
            if (momentInstance.isValid()) {
                return momentInstance;
            }
        },

        /**
         * Creates moment object for frontend field
         *
         * @returns {moment}
         */
        getFrontendMoment: function () {
            var value, format, momentInstance;
            value = this.$frontDateField.val();
            format = this.getDateFormat();
            momentInstance = moment.utc(value, format, true);
            if (momentInstance.isValid()) {
                return momentInstance;
            }
        },

        /**
         * Defines frontend format for date field
         *
         * @returns {string}
         */
        getDateFormat: function () {
            return this.nativeMode ? this.nativeDateFormat : datetimeFormatter.getDateFormat();
        }
    });

    return DatePickerView;
});
