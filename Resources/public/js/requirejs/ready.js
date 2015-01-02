/**
 * Allow to subscribe to application mediator events through requireJS
 */
define({
    load: function (name, parentRequire, onLoad) {
        parentRequire(['oroui/js/app/ready-state-tracker'], function (readyStateTracker) {
            readyStateTracker.whenReady(name, function () {
                onLoad();
            });
        });
    }
});
