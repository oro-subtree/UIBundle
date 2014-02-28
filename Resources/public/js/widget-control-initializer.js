/* global define */
define(['jquery', 'underscore', 'oro/dialog-widget', 'oro/widget-manager', 'oro/mediator'],
    function($, _, DialogWidget, WidgetManager, mediator) {
        'use strict';

        /**
         * @export oro/widget-control-initializer
         * @class oro.WidgetControlInitializer
         */
        return {
            init: function(container) {
                var self = this;
                container.find('[data-widget-type]').each(
                    function (index, controlElement) {
                        self.initWidgetControlElement(controlElement);
                    }
                );
            },
            initWidgetControlElement: function (controlElement) {
                var self = this;
                controlElement = $(controlElement);
                if (controlElement.data('widget-initialized')) {
                    return;
                } else {
                    controlElement.data('widget-initialized', true);
                }

                var widgetType        = controlElement.data('widget-type');
                var widgetEvent       = controlElement.data('widget-event') || 'click';

                require(['oro/' + widgetType + '-widget'],
                    function (Widget) {

                        /**
                         * @param event
                         * @callback Callback to create and run widget
                         */
                        var widgetRenderDelegate = function (event) {
                            var widgetOptions     = $.extend(true, {}, controlElement.data('widget-options'));
                            var allowMultiple     = controlElement.data('widget-multiple');
                            var reloadEvent       = controlElement.data('widget-reload-event')
                                || 'widget_success:' + widgetOptions.alias;
                            var reloadGridName    = controlElement.data('widget-reload-grid-name');
                            var reloadWidgetAlias = controlElement.data('widget-reload-widget-alias');

                            if (!widgetOptions.url && controlElement.data('url')) {
                                widgetOptions.url = controlElement.data('url') || controlElement.attr('href');
                            }

                            if (!allowMultiple) {
                                // Only one instance of widget is allowed
                                if (controlElement.data('widget-opened')) {
                                    return;
                                } else {
                                    controlElement.data('widget-opened', true);
                                }
                            }

                            // Create and open widget
                            var widget = new Widget(widgetOptions);

                            if (reloadWidgetAlias) {
                                mediator.on(reloadEvent, function () {
                                    WidgetManager.getWidgetInstanceByAlias(reloadWidgetAlias, function (widget) {
                                        widget.loadContent();
                                    });
                                });
                            }

                            if (reloadGridName) {
                                mediator.on(reloadEvent, function () {
                                    mediator.trigger('datagrid:doRefresh:' + reloadGridName);
                                });
                            }

                            if (!allowMultiple) {
                                widget.on('widgetRemove', function () {
                                    controlElement.data('widget-opened', false);
                                });
                            }

                            widget.render();

                            event.preventDefault();
                        };

                        if(controlElement.data('toggle') == 'tab'){
                            $(controlElement).on('shown.bs.tab', widgetRenderDelegate);
                        }else{
                            $(controlElement).on(
                                widgetEvent,
                                widgetRenderDelegate
                            );
                        }
                    }
                );
            }
        };
    }
);
