var sliderFactory = angular.module('slider', ['gameSocket']);
sliderFactory.directive('resizableColumns', ['$timeout', 'gameSocket', function ($timeout, gameSocket) {
    var helper = {
        tableCells: [],
        arrayRanges: {},

        createTableCells: function (table, arrayRanges) {
            if (0 === this.tableCells.length) {
                this.tableCells = table.find('td');
                this.tableCells.each(function (index) {
                    $(this).append('<div class="value-range">' + arrayRanges[index].score + '</div>');
                });
            }
            this.arrayRanges = arrayRanges;
        },

        updateArrayRanges: function () {
            var self = this;
            this.tableCells.each(function (index) {
                self.arrayRanges[index].width = $(this).width() + "px; ";
            });

            return this.arrayRanges;
        }
    };

    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            scope.$watch(attrs.ngModel, function () {
                // Timeout to let ng-repeat modify the DOM
                $timeout(function () {
                    var arrayRanges = ngModel.$modelValue;
                    helper.createTableCells(element, arrayRanges);
                    scope.slider = element;

                    if (!arrayRanges || !arrayRanges.length) {
                        return;
                    }

                    element.colResizable({
                        liveDrag: true,
                        draggingClass: "rangeDrag",
                        gripInnerHtml: "<div class='rangeGrip'></div>",
                        minWidth: 8,
                        onResize: function (event) {
                            scope.game.resizableColumns = helper.updateArrayRanges();
                            gameSocket.emitUpdateSlider(scope.game);
                            gameSocket.emitFreeUI();
                        },
                        onDrag: function (event) {
                            scope.game.resizableColumns = helper.updateArrayRanges();
                            gameSocket.emitUpdateResizableColumns(scope.game.resizableColumns, scope.game._id);
                            gameSocket.emitBusyUI();
                        }
                    });
                });
            });
        }
    };
}]);