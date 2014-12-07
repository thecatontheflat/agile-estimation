var loggerDialog = angular.module("loggerDialog", []);

loggerDialog.factory('loggerDialog', function() {
    return {
        init: function () {
            $(function () {
                var logger = $("#logger");
                logger.dialog({
                    modal: true,
                    autoOpen: false,
                    width: 600,
                    buttons: {
                        Ok: function() {
                            $(this).dialog("close");
                        }
                    }
                });
                $('#logger-link').on('click', function (event) {
                    logger.dialog('open');
                });
            });
        }
    };
});
