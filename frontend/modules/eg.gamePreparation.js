var app = angular.module("gamePreparation", ['ngSanitize', 'buttonLabel', 'backendRoutes', 'ui.sortable', 'angularFileUpload']);

app.controller('GamePreparationController', ['$http', '$scope', '$window', 'backendRoutes', 'buttonLabel', '$upload', function ($http, $scope, window, backendRoutes, buttonLabel, $upload) {
    $scope.game = {};
    $scope.game.cards = [];
    $scope.backendRoutes = backendRoutes;
    $scope.newCard = {};

    $scope.newCardDialog = {};

    $scope.onFileSelect = function ($files) {
        var file = $files[0];
        $scope.upload = $upload.upload({
            url: backendRoutes.importJiraXmlL,
            method: 'POST',
            file: file
        }).success(function (data, status, headers, config) {
            $scope.game.cards = data;
        }).error(function (data, status) {
            // alert(data);
        });
    };

    var helper = {
        columns: [1, 2, 3, 5, 8, 13, 21],
        setImportResult: function (importClass, importMessage) {
            $scope.importFormClass = importClass;
            $scope.importFormLabel = importMessage;
        },
        generateResizableColumns: function () {
            var result = [];
            for (var i = 0; i < this.columns.length; i++) {
                result.push({
                    score: this.columns[i],
                    width: '100px'
                })
            }

            return result;
        }
    };

    $scope.init = function (gameId) {
        $scope.newCardDialog = $('#newCardDialog');
        $http.get(backendRoutes.findGameApi(gameId))
            .success(function (data) {
                $scope.game = data;
                $scope.game.resizableColumns = helper.generateResizableColumns();
            });
    };

    $scope.update = function (event) {
        var referenceFound = false;
        var card = {};
        var updateCards = null;
        $scope.game.cardsRow = [];
        $scope.game.state = 'active';
        $scope.game.cardsDeck = angular.copy($scope.game.cards);
        $scope.game.cardsDeck.forEach(function (card, index) {
            $scope.game.cardsDeck[index].description = '';

            if (true === card.isReference) {
                $scope.game.cardsRow.push(card);
                $scope.game.cardsDeck.splice(index, 1);

                referenceFound = true;
            }
        });

        // Fallback if user did not set a reference
        if (!referenceFound) {
            card = $scope.game.cardsDeck.pop();
            card.isReference = true;
            $scope.game.cardsRow.push(card);
        }

        updateCards = $http.post(backendRoutes.updateGameApi($scope.game._id), $scope.game);
        updateCards.finally(function () {
            buttonLabel.setOriginLabel(event);
        });
    };

    $scope.reverseOrder = function () {
        $scope.game.cards.reverse();
    };

    $scope.showNewCardDialog = function () {
        $scope.newCard = {};
        $scope.newCardDialog.modal('show');
    };

    $scope.showEditCardDialog = function (card) {
        $scope.newCard = card;
        $scope.newCardDialog.modal('show');
    };

    $scope.newCardSubmit = function () {
        // Removing duplicated entry, if exists
        var duplicateFound = false;
        $scope.game.cards.forEach(function(card, index, sourceArray) {
            if ($scope.newCard.key == card.key) {
                sourceArray[index] = angular.copy($scope.newCard);
                duplicateFound = true;
            }
        });

        if (!duplicateFound) {
            $scope.game.cards.push($scope.newCard);
        }

        $scope.newCard = {};
        $scope.newCardDialog.modal('hide');
    };

    $scope.removeCard = function (card) {
        $scope.game.cards.splice($scope.game.cards.indexOf(card), 1);
    };

    $scope.importFromJiraREST = function (event) {
        //jiraREST.importByLabel(
        //    event,
        //    {label: $scope.label},
        //    {
        //        success: function (data) {
        //            if (0 === data.length) {
        //                helper.setImportResult('has-error', 'Can not import by label - "' + $scope.label + '"');
        //
        //                return;
        //            }
        //            helper.setImportResult('has-success', 'Done!');
        //            $scope.game.cards = data;
        //        },
        //        error: function (data) {
        //            helper.setImportResult('has-error', data.message);
        //        },
        //        'finally': function () {
        //            buttonLabel.setOriginLabel(event);
        //        }
        //    }
        //);
    };
}]);

$(function () {
    $('select').selectpicker();

    $('#newCardKey').popover({
        content: "Card key to be displayed on the card. It is usually an issue ID from your issue tracker",
        placement: "left",
        trigger: "hover"
    });

    $('#newCardLink').popover({
        content: "URL to be displayed in the description box. This is usually the URL of your issue, for quick accessibility",
        placement: "left",
        trigger: "hover"
    });

    $('#newCardTitle').popover({
        content: "Title to be displayed in the tooltip and in the description box",
        placement: "left",
        trigger: "hover"
    });

    $('#newCardIcon').popover({
        content: "Choose an icon to be displayed on the card. This is useful for quick identification of the issue type - a bug, a story, an improvement etc. Use them on your own taste",
        placement: "left",
        trigger: "hover"
    });

    $('#newCardReporter').popover({
        content: "Author of the issue. Will be displayed on the card.",
        placement: "left",
        trigger: "hover"
    });

    $('#newCardDescription').popover({
        content: "Description to be displayed in the description box on the desk",
        placement: "left",
        trigger: "hover"
    });
});
