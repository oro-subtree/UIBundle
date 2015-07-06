define(['jquery', 'jquery-ui'], function($) {
    'use strict';

    /* datepicker extend:start */
    (function() {

        var original = {
            _destroyDatepicker: $.datepicker.constructor.prototype._destroyDatepicker
        };

        /**
         * Combines space-separated line of events with widget's namespace
         *  for handling datepicker's position change
         *
         * @returns {string}
         * @private
         */
        function getEvents(uuid) {
            var events = ['scroll', 'resize'],
                ns = 'datepicker-' + uuid;

            events = $.map(events, function(eventName) {
                return eventName + '.' + ns;
            });

            return events.join(' ');
        }

        /**
         * Process position update for datepicker element
         */
        function updatePos() {
            var pos, isFixed, offset, inst, dialogIsBelow,
                input = this, $input = $(this);

            inst = $.datepicker._getInst(input);

            if (!$.datepicker._pos) { // position below input
                pos = $.datepicker._findPos(input);
                pos[1] += input.offsetHeight; // add the height
            }

            isFixed = false;
            $input.parents().each(function() {
                isFixed |= $(this).css("position") === "fixed";
                return !isFixed;
            });

            offset = {left: pos[0], top: pos[1]};
            offset = $.datepicker._checkOffset(inst, offset, isFixed);
            inst.dpDiv.css({left: offset.left + "px", top: offset.top + "px"});

            dialogIsBelow = inst.dpDiv.is(':visible') && offset.top - $input.offset().top > 0;

            if ($input.hasClass(dateDialogClassName) !== dialogIsBelow) {
                $input.trigger('datepicker:dialogReposition', dialogIsBelow ? 'below' : 'above');
                $input.toggleClass(dateDialogClassName, dialogIsBelow);
            }

        }

        var _showDatepicker = $.datepicker.constructor.prototype._showDatepicker,
            _hideDatepicker = $.datepicker.constructor.prototype._hideDatepicker,
            dateDialogClassName = 'ui-datepicker-dialog-is-below';

        /**
         * Bind update position method after datepicker is opened
         *
         * @param elem
         * @override
         * @private
         */
        $.datepicker.constructor.prototype._showDatepicker = function(elem) {
            var events, input;

            _showDatepicker.apply(this, arguments);

            input = elem.target || elem;
            events = getEvents(input.id);

            $(input).removeClass(dateDialogClassName).parents().add(window).each(function() {
                $(this).on(events, $.proxy(updatePos, input));
                // @TODO develop other approach than hide on scroll
                // because on mobile devices it's impossible to open calendar without scrolling
                /*$(this).on(events, function () {
                    // just close datepicker
                    $.datepicker._hideDatepicker();
                    input.blur();
                });*/
            });

            updatePos.call(input);
        };

        /**
         * Remove all handlers before closing datepicker
         *
         * @param elem
         * @override
         * @private
         */
        $.datepicker.constructor.prototype._hideDatepicker = function(elem) {
            var events, input = elem;

            if (!elem) {
                if (!$.datepicker._curInst) {
                    return;
                }
                input = $.datepicker._curInst.input.get(0);
            }
            events = getEvents(input.id);

            $(input).parents().add(window).each(function() {
                $(this).off(events);
            });

            _hideDatepicker.apply(this, arguments);
        };

        $.datepicker.constructor.prototype._destroyDatepicker = function() {
            if (!this._curInst) {
                return;
            }
            if (this._curInst.dpDiv) {
                this._curInst.dpDiv.remove();
            }
            original._destroyDatepicker.apply(this, arguments);
        };
    }());
    /* datepicker extend:end */
});
