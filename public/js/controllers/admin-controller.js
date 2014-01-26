'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AdminController', function ($scope, $modal, $route, LoginService, storeItems) {

        if (LoginService.isLoggedIn()) {

            storeItems.getAllItemsByType('', function (data) {
                $scope.items = data;
            });

            // for add item modal
            $scope.open = function (itemId) {
                var modalInstance = $modal.open({
                    templateUrl: 'public/partials/dialogs/add-item-dialog.html',
                    controller: 'AddItemController',
                    resolve: {
                        selected: function () {
                            return itemId;
                        }
                    }
                });
//                modalInstance.result.then(function (selectedItem) {
//                    $scope.selected = selectedItem;
//                }, function () {
//                    console.log('Modal dismissed at: ' + new Date());
//                });
            };

            $scope.deleteItem = function (itemId) {
                storeItems.deleteItem(itemId, function () {
                    $route.reload();
                    alert("Удаление прошло успешно.")
                });
            }

        }

    });