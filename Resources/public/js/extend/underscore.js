define(['underscore', 'asap'], function(_, asap) {
    'use strict';

    _.mixin({
        nl2br: function(str) {
            var breakTag = '<br />';
            return String(str).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
        },

        trunc: function(str, maxLength, useWordBoundary, hellip) {
            hellip = hellip || '&hellip;';
            var toLong = str.length > maxLength;
            str = toLong ? str.substr(0, maxLength - 1) : str;
            var lastSpace = str.lastIndexOf(' ');
            str = useWordBoundary && toLong && lastSpace > 0 ? str.substr(0, lastSpace) : str;
            return toLong ? str + hellip : str;
        },

        isMobile: function() {
            var elem = document.getElementsByTagName('body')[0];
            return elem && (' ' + elem.className + ' ')
                .replace(/[\t\r\n\f]/g, ' ')
                .indexOf(' mobile-version ') !== -1;
        },

        /* This function is available in newer underscore/lodash versions */
        findIndex: function(collection, predicate) {
            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if (predicate(item)) {
                    return i;
                }
            }
        },

        /* This function is available in newer underscore/lodash versions */
        findLastIndex: function(collection, predicate) {
            for (var i = collection.length - 1; i >= 0; i--) {
                var item = collection[i];
                if (predicate(item)) {
                    return i;
                }
            }
        },

        trim: function(text) {
            return text.replace(/^\s*/, '').replace(/\s*$/, '');
        }
    });

    _.template = _.wrap(_.template, function(original, text, settings, oldSettings) {
        text = _.trim(text).replace(/^<%#/, '').replace(/#%>$/, '');
        var escapedText = text;

        var levelOffsets = {};
        var level = 0;
        var offsetDelta = 0;

        var escapeText = function(text) {
            text = text.replace(/&([amplgt;]+%)/g, '&amp;$1');
            text = text.replace(/<%/g, '&lt;%')
                .replace(/%>/g, '%&gt;');
            return text;
        };

        text.replace(/(<%#)|(#%>)/g, function(match, open, close, offset) {
            offset += offsetDelta;
            if (open) {
                level++;
                levelOffsets[level] = offset;
            }
            if (close && level) {
                var start = escapedText.slice(0, levelOffsets[level]);
                var end = escapedText.slice(offset + close.length);
                var escape = escapedText.slice(levelOffsets[level] + 3, offset);
                var newEscape = escapeText(escape);
                offsetDelta += newEscape.length - escape.length - 6;
                escapedText = start + newEscape + end;
                level--;
            }
            // Adobe VMs need the match returned to produce the correct offest.
            return match;
        });
        arguments[1] = _.trim(escapedText);
        return original.apply(this, _.rest(arguments));
    });

    _.defer = asap;

    return _;
});
