'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AddItemController', function ($scope, $modalInstance, $http, items, storeItems) {

        $scope.downloadSize = "Предпочтительный размер изображения: 20-50 КБ";

        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.uploadedFile = args.file;
                $scope.newItem.image = args.file.name;
                $scope.downloadSize = "Размер загруженного изображения " + (args.file.size / 1024).toFixed(0) + " КБ";
            });
        });

        $scope.newItem = {};

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $scope.newItem.type = 2; //should be removed
            storeItems.addItem($scope.newItem, $scope.uploadedFile, function () {
                alert("QQQ");
            });
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });