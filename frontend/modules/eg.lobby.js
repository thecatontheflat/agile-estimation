angular.module("lobby", ['backendRoutes', 'buttonLabel'])
    .controller("LobbyController", function($scope, $http, backendRoutes, buttonLabel) {
        $scope.games = [];
        $scope.formAction = '';
        $scope.newGameName = '';

        $http.get(backendRoutes.listGamesApi)
            .success(function (data) {
                $scope.games = data;
            });

        $scope.createNewGame = function (event) {
            event.preventDefault();

            var register = $http.post($scope.formAction);

            // Clean ajax object
            $scope.ajaxError = null;

            register.success(function(data, status, headers, config) {
                window.location.href = data.url;
            });
            register.error(function(data, status, headers, config) {
                data.error.message = data.error.details.pop();
                $scope.ajaxError = data.error;
            });
            register.finally(function () {
                buttonLabel.setOriginLabel(event);
            });
        };

        $scope.getPrepareGameUrl = function(gameId) {
            return backendRoutes.gamePrepare(gameId);
        };

        $scope.getActiveGameUrl = function (gameId) {
            return backendRoutes.gameActive(gameId);
        };

    }).directive("fmAction", function() {
        return function(scope, element, attributes) {
            scope.formAction = attributes.action;
        }
    });