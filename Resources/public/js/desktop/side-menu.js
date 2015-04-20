/*global define*/
/*jslint nomen: true*/
define(['../side-menu', '../mediator', 'oroui/js/localStorage'], function ($, mediator, localStorage) {
    'use strict';

    var STATE_STORAGE_KEY = 'main-menu-state',
        MAXIMIZED_STATE = 'maximized',
        MINIMIZED_STATE = 'minimized';

    $.widget('oroui.desktopSideMenu', $.oroui.sideMenu, {
        /**
         * Do initial changes
         */
        _init: function () {
            this._update();
        },

        /**
         * Updates menu's minimized/maximized view
         */
        _update: function () {
            var isMinimized = localStorage.getItem(STATE_STORAGE_KEY) !== MAXIMIZED_STATE;
            this.element.toggleClass('minimized', isMinimized);
            $('#main').toggleClass('main-menu-maximized', isMinimized);
            if (isMinimized) {
                this._convertToDropdown();
            } else {
                this._convertToAccordion();
            }
        },

        /**
         * Handles menu toggle state action
         */
        _toggle: function () {
            localStorage.setItem(
                STATE_STORAGE_KEY,
                this.element.hasClass('minimized') ? MAXIMIZED_STATE : MINIMIZED_STATE
            );
            this._update();
            mediator.trigger('layout:adjustHeight');
        }
    });

    return $;
});
