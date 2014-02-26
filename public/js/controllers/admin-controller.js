'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AdminController', function ($scope, $modal, $route, LoginService, storeItems) {

        if (LoginService.isLoggedIn()) {

            storeItems.getAllItemsByType('', function (data) {
                $scope.items = data;
            });

            // for add item modal
            $scope.addNewItem = function (itemId) {
                var modalInstance = $modal.open({
                    templateUrl: 'public/partials/dialogs/add-item-dialog.html',
                    controller: 'AddItemController',
                    resolve: {
                        selected: function () {
                            return itemId;
                        }
                    }
                });
            };

            // for visitors statistics modal
            $scope.openVisitorsStatistics = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'public/partials/dialogs/visitors-statistics-dialog.html',
                    controller: 'VisitorsController',
                    resolve: {
//                        selected: function () {
//                            return itemId;
//                        }
                    }
                });
            };


            $scope.deleteItem = function (itemId) {
                storeItems.deleteItem(itemId, function () {
                    $route.reload();
                    alert("Удаление прошло успешно.")
                });
            }

        }

    });