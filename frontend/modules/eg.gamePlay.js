var app = angular.module("playGame", ['ui.sortable', 'ngSanitize', 'gameSocket', 'buttonLabel', 'sortableCard', 'slider'])
    .controller('playGameController', function ($scope, gameSocket, buttonLabel, sortableCard, $timeout) {
        var sortableCardEvents = {
            start: function (event, ui) {
                $(event.target).data("ui-sortable").floating = true;
            },
            update: function (event, ui) {
                $timeout(function () {
                    gameSocket.emitUpdateSortableCards($scope.game, ui.item.sortable.dropindex);
                });
            }
        };
        // Get options for sortable cards
        var cardsDeck = sortableCard.getDeckCards(sortableCardEvents);
        var cardsRow = sortableCard.getRowCards(sortableCardEvents);

        $scope.game = {};
        $scope.allCardsContainer = {};
        $scope.loggerStack = [];

        $scope.cardsRowOptions = cardsRow;
        $scope.cardsDeckOptions = cardsDeck;
        $scope.getCardPositionStyle = sortableCard.getCardPositionStyle;
        $scope.gameSocket = gameSocket;
        $scope.exportField = '';

        $scope.gameFinished = false;

        $scope.init = function (id, isOwner, isPlayerExists, avatar) {
            $scope.gameInfo = {
                gameId: id,
                isOwner: isOwner,
                isPlayerExists: isPlayerExists,
                avatar: avatar
            };
        };

        gameSocket.runSocket($scope);
        sortableCard.initClickEvent();

        $scope.sendToJira = function (event) {
            var data = {
                field: $scope.exportField,
                issues: $scope.game.cards
            };

            //jiraREST.exportStoryPointToJira(data, {
            //    success: function (data) {
            //        $scope.gameExported = true;
            //    },
            //    'finally': function () {
            //        buttonLabel.setOriginLabel(event);
            //    }
            //});
        };
    });
