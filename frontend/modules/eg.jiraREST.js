var jiraREST = angular.module('jiraREST', ['backendRoutes']);
jiraREST.factory('jiraREST', function ($http, backendRoutes) {
    return {
        importByLabel: function (event, requestData, callbacks) {
            var jiraImporter = $http.post(backendRoutes.importCardsFromJira, requestData);

            jiraImporter.success(function (data) {
                if (callbacks && 'function' === typeof callbacks.success) {
                    callbacks.success(data);
                }
            });
            jiraImporter.error(function (data) {
                if (callbacks && 'function' === typeof callbacks.error) {
                    callbacks.error(data);
                }
            });
            jiraImporter.finally(function () {
                if (callbacks && 'function' === typeof callbacks.finally) {
                    callbacks.finally();
                }
            });
        },

        exportStoryPointToJira: function (requestData, callbacks) {
            var jiraExporter = $http.post(backendRoutes.sendToJira, requestData);

            jiraExporter.success(function (data) {
                if (callbacks && 'function' === typeof callbacks.success) {
                    callbacks.success(data);
                }
            });
            jiraExporter.finally(function () {
                if (callbacks && 'function' === typeof callbacks.finally) {
                    callbacks.finally();
                }
            });
        },

        getIssueByKey: function (keyIssue, callbacks) {
            var jiraImporter = $http.get(backendRoutes.getJiraIssue(keyIssue));

            jiraImporter.success(function (data) {
                if (callbacks && 'function' === typeof callbacks.success) {
                    callbacks.success(data);
                }
            });
            jiraImporter.error(function (data) {
                if (callbacks && 'function' === typeof callbacks.error) {
                    callbacks.error(data);
                }
            });
            jiraImporter.finally(function () {
                if (callbacks && 'function' === typeof callbacks.finally) {
                    callbacks.finally();
                }
            });
        }
    };
});