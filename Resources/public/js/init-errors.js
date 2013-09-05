/* jshint browser:true */
/* global require */
require(['jquery'],
function($) {
    'use strict';

    var errorPopupPosition = function (){
        var boxErrors = $('div.popup-box-errors');
        boxErrors.css('margin-top', ($(window).height()/2 - boxErrors.height()) +'px');
    };

    $(function() {
        errorPopupPosition();
        $(window).resize(errorPopupPosition);

        setTimeout(function() {
            // emulates 'document ready state' for selenium tests
            document['page-rendered'] = true;
        }, 100);
    });
});