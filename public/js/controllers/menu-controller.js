'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('MenuController', function ($scope, $modal, $http, $timeout, $location) {

        $scope.fakeItems = ['item1', 'item2', 'item3'];
        $scope.loginForm = function () {
            var modalInstance = $modal.open({
                templateUrl: 'public/partials/dialogs/login-dialog.html',
                controller: 'LoginController',
                resolve: {
                    items: function () {
                        return $scope.fakeItems;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

    });