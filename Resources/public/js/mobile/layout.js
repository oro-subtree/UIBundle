/*jshint browser: true*/
/*jslint browser: true*/
/*global define*/
define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        pageHeader = require('oroui/js/mobile/page-header');
    require('oroui/js/mobile/side-menu');

    /**
     * Instantiate sideMenu widget
     */
    function initMainMenu() {
        var menu = $('#main-menu');
        menu.insertAfter($('#oroplatform-header'));
        menu.mobileSideMenu({
            toggleSelector: '#main-menu-toggle'
        });
    }

    /**
     * Fixes issue when header with position fixed loses its place after blur event on some input
     *
     * @see http://dansajin.com/2012/12/07/fix-position-fixed/
     * @see http://stackoverflow.com/questions/14492613/ios-ipad-fixed-position-breaks-when-keyboard-is-opened
     */
    function fixFixedHeader() {
        var $body = $('body');
        $(document)
            .on('focus', ':input', function () {
                $body.addClass('fixfixed');
            })
            .on('blur', ':input', function () {
                $body.removeClass('fixfixed');
                _.debounce(function () {
                    $(document).scrollTop($(document).scrollTop());
                }, 1);
            });
    }

    /**
     * Initiate mobile layout
     */
    function initLayout() {
        fixFixedHeader();
        initMainMenu();
        pageHeader.init();
    }

    /**
     * Initializes mobile layout
     *
     * @export oroui/js/mobile/layout
     * @name oro.mobile.layout
     */
    return {
        init: function () {
            $(initLayout);
        }
    };
});
