var gameSocket = angular.module("gameSocket", ['socket', 'backendRoutes', 'sortableCard']);

gameSocket.factory('gameSocket', function (socket, backendRoutes, sortableCard, $timeout) {
    var gameScope = null;
    var STATE_ARCHIVE = 'archive';
    var helper = {
        disableGame: function () {
            gameScope.slider.disableSlider();
            gameScope.cardsRowOptions.disabled = true;
            gameScope.gameFinished = true;
        },

        enableUI: function () {
            gameScope.slider.enableSlider();
            gameScope.cardsRowOptions.disabled = false;
        },

        disableUI: function () {
            gameScope.slider.disableSlider();
            gameScope.cardsRowOptions.disabled = true;
        }
    };

    return {
        runSocket: function ($scope) {
            var self = this;
            gameScope = $scope;

            // All socket stuff, that is related with game
            socket.on('connect', function () {
                var userName = null;
                if (false === gameScope.gameInfo.isPlayerExists) {
                    userName = prompt('What is your name?');

                    if (null === userName || '' == userName) {
                        window.location.href = backendRoutes.index;

                        return;
                    }

                    gameScope.gameInfo.userName = userName;
                }
                socket.emit('joinGame', $scope.gameInfo);
                // Receivers
                socket.on('error', function (error) {
                    alert(error);
                });

                socket.on('joinGame', function (data) {
                    if ($scope.gameInfo.gameId === data._id) {
                        $scope.allCardsContainer = data.cards;
                        $scope.game = data;
                        if (STATE_ARCHIVE === $scope.game.state) {
                            $timeout(function () {
                                helper.disableGame();
                                sortableCard.grabCards();
                            });

                            return;
                        }

                        $scope.slider.deletePlugin();
                        $timeout(function () {
                            sortableCard.grabCards();
                        });
                    }
                });

                socket.on('updateGameField', function (data) {
                    if ($scope.gameInfo.gameId === data._id) {
                        $scope.game = data;
                        if (STATE_ARCHIVE === $scope.game.state) {
                            $timeout(function () {
                                helper.disableGame();
                                sortableCard.grabCards();
                            });

                            return;
                        }

                        $scope.slider.deletePlugin();
                        $timeout(function () {
                            sortableCard.grabCards();
                        });
                    }
                });

                socket.on('updateResizableColumns', function (data) {
                    $scope.game.resizableColumns = data.ranges;
                    $scope.slider.dragGrips();
                });

                socket.on('blinkCard', function (cardIndex) {
                    sortableCard.blinkCardByIndex(cardIndex);
                });

                socket.on('busy-ui', function () {
                    helper.disableUI();
                });

                socket.on('free-ui', function () {
                    helper.enableUI();
                });

                socket.on('updateLoggerStack', function (loggerItem) {
                    $scope.loggerStack.push(loggerItem);
                });
                self.emitLogEvent('joined game');
            });
        },
        emitUpdateGame: function (game) {
            game.cards = {};
            socket.emit('updateGameField', game);
        },
        emitUpdateSlider: function (game) {
            this.emitUpdateGame(game);
            this.emitLogEvent('moved slider holder');
        },
        emitUpdateResizableColumns: function (resizableColumns, gameId) {
            socket.emit('updateResizableColumns', {ranges: resizableColumns, _id: gameId});
        },
        emitUpdateSortableCards: function (game, blinkCardIndex) {
            sortableCard.grabCards();
            var movedCard = sortableCard.getCardTextByIndex(blinkCardIndex);

            this.emitUpdateGame(game);
            socket.emit('blinkCard', blinkCardIndex);
            this.emitLogEvent('moved card - ' + movedCard);
        },
        emitBusyUI: function () {
            socket.emit('busy-ui');
        },
        emitFreeUI: function () {
            socket.emit('free-ui');
        },
        emitFinishGame: function (game) {
            game.state = STATE_ARCHIVE;
            this.emitUpdateGame(game);
            this.emitLogEvent('finished game');
            helper.disableGame();
        },
        emitLogEvent: function (eventName) {
//            var loggerItem = {
//                date: new Date(),
//                event: eventName,
//                name: gameScope.gameInfo.userName
//            };
//            socket.emit('updateLoggerStack', loggerItem);
        }
    };
});