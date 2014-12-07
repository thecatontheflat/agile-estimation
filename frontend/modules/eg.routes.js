var app = angular.module('backendRoutes', []);

app.factory('backendRoutes', function() {
    return {
        lobby: '/lobby',
        index: '/',

        importJiraXmlL: '/import',
        listGamesApi: '/game/api/list',

        findGameApi: function(hash) {
            return '/game/api/find/' + hash;
        },

        updateGameApi: function(id) {
            return '/game/api/update/' + id;
        },

        gamePrepare: function(id) {
            return '/game/prepare/' + id;
        },

        gameActive: function (id) {
            return '/game/play/' + id;
        },

        finishGameApi: function(id) {
            return '/game/api/finish-preparation/' + id;
        },

        getJiraIssue: function (key) {
            return '/import/get/issue/' + key;
        }
    };
});