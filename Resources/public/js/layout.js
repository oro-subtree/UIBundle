/* jshint browser:true */
/* global define */
define(['jquery', 'oro/translator', 'bootstrap-tooltip', 'jquery-ui', 'jquery-ui-timepicker'],
function($, __) {
    'use strict';

    /**
     * Fix for IE8 compatibility
     */
    if (!Date.prototype.toISOString) {
        (function() {
            function pad(number) {
                var r = String(number);
                if ( r.length === 1 ) {
                    r = '0' + r;
                }
                return r;
            }
            Date.prototype.toISOString = function() {
                return this.getUTCFullYear() +
                    '-' + pad(this.getUTCMonth() + 1) +
                    '-' + pad(this.getUTCDate()) +
                    'T' + pad(this.getUTCHours()) +
                    ':' + pad(this.getUTCMinutes()) +
                    ':' + pad(this.getUTCSeconds()) +
                    '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) +
                    'Z';
            };
        }());
    }

    return {
        init: function (container) {
            container = $(container || document.body);
            this.styleForm(container);

            container.find('input.datepicker').each(function (index, el) {
                el = $(el);
                el.datepicker({
                    dateFormat: el.attr('data-dateformat') || 'm/d/y',
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-80:+1',
                    showButtonPanel: true,
                    currentText: __('Now')
                });
            });

            container.find('input.datetimepicker').each(function (index, el) {
                el = $(el);
                el.datetimepicker({
                    dateFormat: el.attr('data-dateformat') || 'm/d/y',
                    timeFormat: el.attr('data-timeformat') || 'hh:mm tt',
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-80:+1',
                    showButtonPanel: true,
                    currentText: __('Now')
                });
            });

            container.find('[data-spy="scroll"]').each(function () {
                var $spy = $(this);
                $spy.scrollspy($spy.data());
                $spy = $(this).scrollspy('refresh');
                $('.scrollspy-nav ul.nav li').removeClass('active');
                $('.scrollspy-nav ul.nav li:first').addClass('active');
            });

            container.find('[data-toggle="tooltip"]').tooltip();
            container.find('[data-toggle="popover"]').popover({
                animation: true,
                delay: { show: 0, hide: 0 },
                trigger: 'click',
                html: true
            });
        },

        hideProgressBar: function() {
            var $bar = $('#progressbar');
            if ($bar.is(':visible')) {
                $bar.hide();
                $('#page').show();
            }
        },

        styleForm: function(container) {
            if ($.isPlainObject($.uniform)) {
                var elements = $(container).find('input:file, select:not(.select2)');
                elements.uniform();
                elements.trigger('uniformInit');
            }
        }
    };
});