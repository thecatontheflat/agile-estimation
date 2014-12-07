angular.module("reg-auth", ['buttonLabel'])
    .controller("registerController", function($scope, $http, buttonLabel) {
        $scope.formAction = '';
        $scope.formElement = null;
        $scope.user = {};


        /**
         * Register new user
         * @param event
         */
        $scope.user.registerAction = function (event) {
            event.preventDefault();
            var register = $http.post($scope.formAction, {user: $scope.user});

            // Clean ajax object
            $scope.ajaxError = null;
            $scope.ajaxSuccess = null;

            register.success(function(data, status, headers, config) {
                $scope.ajaxSuccess = data.success;
            });
            register.error(function(data, status, headers, config) {
                $scope.ajaxError = data.error;
            });
            register.finally(function () {
                buttonLabel.setOriginLabel(event);
            });
        };

        /**
         * Login user
         * @param event
         */
        $scope.user.loginAction = function (event) {
            var login = $http.post($scope.loginFormAction, $scope.user);

            // Clean ajax object
            $scope.ajaxError = null;
            $scope.ajaxSuccess = null;

            login.success(function(data, status, headers, config) {
                window.location.href = data.url;
            });
            login.error(function(data, status, headers, config) {
                $scope.ajaxError = data.error;
            });
            login.finally(function () {
                buttonLabel.setOriginLabel(event);
            });
        };

    }).directive("fmAction", function() {
        return function(scope, element, attributes) {
            scope.formAction = attributes.action;
            scope.loginFormAction = attributes.loginAction;
        }
    });