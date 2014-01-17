'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('MenuController', function ($scope, $modal, $rootScope, $location, LoginService) {

        $scope.login = {};
        $scope.$watch(LoginService.isLoggedIn, function () {
            $scope.login.title = LoginService.isLoggedIn() ? "Выход" : "Вход";
            $scope.loginFunction = LoginService.isLoggedIn() ? logoutForm : loginForm;
            $scope.login.isLoggedIn = LoginService.isLoggedIn();
        });
        $scope.login.title = LoginService.isLoggedIn() ? "Выход" : "Вход";

        var loginForm = function () {
            $modal.open({
                templateUrl: 'public/partials/dialogs/login-dialog.html',
                controller: 'LoginController',
                resolve: {
                    items: function () {
                        return null;
                    }
                }
            });
        };

        var logoutForm = function () {
            LoginService.logout(function(data) {
                if (data === "logout") {
                    $location.path('/');
                }
            });
        };
    });