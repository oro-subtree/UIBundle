var Oro = Oro || {};

/**
 * Oro extension of Bootstrap Modal wrapper for use with Backbone.
 */
(function($, _, Backbone) {
    /**
     * Implementation of Bootstrap Modal
     *
     * @class   Oro.BootstrapModal
     * @extends Backbone.BootstrapModal
     */
    Oro.BootstrapModal = Backbone.BootstrapModal.extend({
        /** @property {String} */
        className: 'modal oro-modal-danger',

        /** @property {String} */
        okButtonClass: 'btn-danger',

        /** @property {Object} */
        template: _.template('\
            <% if (title) { %>\
              <div class="modal-header">\
                <% if (allowCancel) { %>\
                  <a class="close">×</a>\
                <% } %>\
                <h3><%- title %></h3>\
              </div>\
            <% } %>\
            <div class="modal-body"><%= content %></div>\
            <div class="modal-footer">\
              <% if (allowCancel) { %>\
                <% if (cancelText) { %>\
                  <a href="#" class="btn cancel"><%- cancelText %></a>\
                <% } %>\
              <% } %>\
              <a href="#" class="btn ok <%= okButtonClass %>"><%- okText %></a>\
            </div>\
        '),

        /**
         * @param {Object} options
         */
        initialize: function(options) {
            if (!options.cancelText) {
                options.cancelText = '';
            }
            if (!options.okButtonClass) {
                options.okButtonClass = this.okButtonClass;
            }
            options = _.extend({
                template: this.template,
                className: this.className
            }, options);

            Backbone.BootstrapModal.prototype.initialize.apply(this, arguments);
        },

        /**
         * Closes the modal
         */
        close: function() {
            Backbone.BootstrapModal.prototype.close.apply(this, arguments);
            this.remove();
        }
    });
})(jQuery, _, Backbone);
/*
*  add to modal-footer if you need button "Cancel"
 <% if (allowCancel) { %>\
 <% if (cancelText) { %>\
 <a href="#" class="btn cancel"><%= cancelText %></a>\
 <% } %>\
 <% } %>\
 */
