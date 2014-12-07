angular.module("buttonLabel", [])
    .factory("buttonLabel", function() {
        return {
            setOriginLabel: function (buttonEvent) {
                var button = angular.element(buttonEvent.target);

                button.html(button.data('original'));
            }
        };
    })
    .directive("btnLabel", function() {
        return function(scope, element, attributes) {
            var msg = 'Loading...';

            scope.originalLabel = '';
            element.on('click', function () {
                scope.originalLabel = $(this).html();
                $(this).html(msg).data('original', scope.originalLabel);
            });
        };
    });