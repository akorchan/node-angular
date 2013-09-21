'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AdminController', function ($scope, $modal, $route, storeItems) {

        storeItems.getAllItemsByType('', function (data) {
            $scope.items = data;
        });

        // for add item modal
        $scope.fakeItems = ['item1', 'item2', 'item3'];
        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'public/partials/dialogs/add-item-dialog.html',
                controller: 'AddItemController',
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

        $scope.deleteItem = function (itemId) {
            storeItems.deleteItem(itemId, function () {
                $route.reload();
                alert("Удаление прошло успешно.")
            });
        }

    });