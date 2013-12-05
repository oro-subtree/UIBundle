/*global define*/
/*jshint browser: true*/
define(['jquery', 'oro/translator', 'bootstrap-tooltip', 'jquery-ui', 'jquery-ui-timepicker'], function ($, __) {
    'use strict';

    // todo: remove this or move somewhere else
    /**
     * Fix for IE8 compatibility
     */
    if (!Date.prototype.toISOString) {
        (function () {
            function pad(number) {
                var r = String(number);
                if (r.length === 1) {
                    r = '0' + r;
                }
                return r;
            }

            Date.prototype.toISOString = function () {
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

    var layout = {};

    layout.init = function (container) {
        container = $(container || document.body);
        this.styleForm(container);

        layout.initScrollspy(container);

        container.find('[data-toggle="tooltip"]').tooltip();

        var handlePopoverMouseout = function (e, popover) {
            var popoverHandler = $(e.relatedTarget).closest('.popover');
            if (!popoverHandler.length) {
                popover.data('popover-timer',
                    setTimeout(function () {
                        popover.popover('hide');
                        popover.data('popover-active', false);
                    }, 500));
            } else {
                popoverHandler.one('mouseout', function (evt) {
                    handlePopoverMouseout(evt, popover);
                });
            }
        };
        $('form label [data-toggle="popover"]')
            .popover({
                animation: true,
                delay: { show: 0, hide: 0 },
                html: true,
                trigger: 'manual'
            })
            .mouseover(function () {
                var popoverEl = $(this);
                clearTimeout(popoverEl.data('popover-timer'));
                if (!popoverEl.data('popover-active')) {
                    popoverEl.data('popover-active', true);
                    $(this).popover('show');
                }
            })
            .mouseout(function (e) {
                var popover = $(this);
                setTimeout(function () {
                    handlePopoverMouseout(e, popover);
                }, 500);
            });

        setTimeout(function () {
            layout.scrollspyTop();
        }, 500);
    };

    layout.hideProgressBar = function () {
        var $bar = $('#progressbar');
        if ($bar.is(':visible')) {
            $bar.hide();
            $('#page').show();
        }
    };

    layout.styleForm = function (container) {
        if ($.isPlainObject($.uniform)) {
            var elements = $(container).find('input:file, select:not(.select2)');
            elements.uniform();
            elements.trigger('uniformInit');
        }
    };

    layout.initScrollspy = function (container) {
        if (layout.isMobile()) {
            layout.replaceScrollspyWithCollapse(container);
            return;
        }

        $('.scrollspy .responsive-section:nth-of-type(1) .scrollspy-title').css('display', 'none');

        container.find('[data-spy="scroll"]').each(function () {
            var $spy = $(this);
            $spy.scrollspy($spy.data());
            $(this).scrollspy('refresh');
            $('.scrollspy-nav ul.nav li').removeClass('active');
            $('.scrollspy-nav ul.nav li:first').addClass('active');
        });
    };

    layout.replaceScrollspyWithCollapse = function (container) {
        container.find('[data-spy="scroll"]').each(function () {
            var $spy = $(this);
            $spy.addClass('accordion');

            $spy.find('.responsive-section').each(function () {
                var $section = $(this);
                $section.removeClass('responsive-section').addClass('accordion-group');

                var blockId = $section.find('.scrollspy-nav-target').attr('id');
                var sel = '#' + blockId + ' + .row-fluid';
                var href = '#' + blockId + ' + .accordion-body';

                $(sel).removeClass('row-fluid').addClass('accordion-body collapse');

                var $toggle = $section.find('.scrollspy-title');
                var $link = $('<a class="accordion-toggle" data-toggle="collapse"></a>')
                    .data('parent', '[data-spy="scroll"]').attr('href', href);
                $toggle.wrap($link);
            });

            $spy.find('.collapse').first().addClass('in');

            $spy.collapse();
        });
    };

    layout.adjustScrollspy = function () {
        if (layout.isMobile()) {
            return;
        }

        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this);
            var spyHeight = $spy.innerHeight();

            var isMultipleRows = $spy.find('.responsive-section').length > 1;

            $spy.find('.responsive-section:last').each(function () {
                var $row = $(this);
                var titleHeight = $row.find('.scrollspy-title').outerHeight();
                var rowAdjHeight = isMultipleRows ? titleHeight + spyHeight : spyHeight;

                var rowOrigHeight = $row.data('originalHeight');
                if (!rowOrigHeight) {
                    rowOrigHeight = $row.height();
                    $row.data('originalHeight', rowOrigHeight);
                }

                if ($row.height() === rowAdjHeight) {
                    return;
                }

                if (rowAdjHeight < rowOrigHeight) {
                    rowAdjHeight = rowOrigHeight;
                }

                $row.outerHeight(rowAdjHeight);
            });

            $spy.scrollspy('refresh');
        });
    };

    layout.scrollspyTop = function () {
        if (layout.isMobile()) {
            return;
        }

        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this);
            var targetSelector = $spy.data('target');
            var target = $(targetSelector);

            target.each(function () {
                var $target = $(this);
                var firstItemHref = $target.find('li.active:first a').attr('href');
                var $firstItem = $(firstItemHref);
                var top = $firstItem.position().top;

                $spy.scrollTop(top);
            });
        });
    };

    /**
     * Are we currently on mobile
     */
    layout.isMobile = (function () {
        var width = null;

        $(function () {
            if (!width) {
                width = window.innerWidth;
            }
        });

        return function () {
            if (!width) {
                width = window.innerWidth;
            }

            return width < 980;
        };
    }());

    return layout;
});
