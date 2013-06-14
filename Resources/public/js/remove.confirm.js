$(function() {
    $(document).on('click', '.remove-button', function (e) {
        var el = $(this);
        var message = el.data('message');
        var doAction = function() {
            $.ajax({
                url: el.data('url'),
                type: 'DELETE',
                success: function (data) {
                    if (Oro.hashNavigationEnabled()) {
                        Oro.Navigation.prototype.setLocation(el.data('redirect'))
                    } else {
                        window.location.href = el.data('redirect');
                    }
                }
            });
        };

        if (!_.isUndefined(Oro.BootstrapModal)) {
            var confirm = new Oro.BootstrapModal({
                title: 'Delete Confirmation',
                content: message,
                okText: 'Yes, Delete'
            });
            confirm.on('ok', doAction);
            confirm.open();
        } else if (window.confirm(message)) {
            doAction();
        }

        return false;
    });
});
