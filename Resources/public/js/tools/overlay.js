define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var overlayTool = {
        hasBackdrop: false,

        createOverlay: function($overlayContent, options) {
            this.hasBackdrop = true;
            $('body').addClass('backdrop');
            $(document.body).append($overlayContent);
            $overlayContent.css({
                zIndex: 10000
            });
            this.updatePosition($overlayContent, options);
            var interval = setInterval(function() {
                if (!$overlayContent.data('interval')) {
                    // fix memory leak
                    clearInterval(interval);
                }
                overlayTool.updatePosition($overlayContent, options);
            }, 400);
            $overlayContent.data('interval', interval);
            return {
                remove: function() {
                    clearInterval(interval);
                    overlayTool.removeOverlay($overlayContent);
                }
            };
        },

        updatePosition: function($overlayContent, options) {
            if (options.position) {
                var _new;
                var old;
                var iterations = 5;
                // try to find position for overlay in several iterations
                do {
                    old = _new || ($overlayContent.css('top') + '.' + $overlayContent.css('left'));
                    $overlayContent.position(options.position);
                    _new = $overlayContent.css('top') + '.' + $overlayContent.css('left');
                    iterations--;
                } while (old !== _new && iterations > 0);
            }
        },

        removeOverlay: function($overlayContent) {
            if ($overlayContent.data('interval')) {
                clearInterval($overlayContent.data('interval'));
            }
            $overlayContent.remove();
            this.hasBackdrop = false;
            this.removeBackdrop();
        },

        removeBackdrop: _.debounce(function() {
            if (!this.hasBackdrop) {
                $('body').removeClass('backdrop');
            }
        }, 50)
    };
    return overlayTool;
});
