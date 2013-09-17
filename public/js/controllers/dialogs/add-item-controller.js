'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AddItemController', function ($scope, $modalInstance, $http, items, storeItems) {

        $scope.downloadSize = "Предпочтительный размер изображения: 20-50 КБ";

        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.uploadedFile = args.file;
                $scope.downloadSize = "Размер загруженного изображения " + (args.file.size / 1024).toFixed(0) + " КБ";
            });
        });

        $scope.newItem = {};

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $scope.newItem.type = $scope.comboboxObject.currentItem.id; //should be removed
            storeItems.addItem($scope.newItem, $scope.uploadedFile, function () {
                $modalInstance.close($scope.selected.item);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.listOfTypes = [
            {
                "id": "1",
                "name": "Паста"
            },
            {
                "id": "2",
                "name": "Сыры"
            },
            {
                "id": "3",
                "name": "Мясные издения"
            },
            {
                "id": "4",
                "name": "Оливковое масло и оливки"
            },
            {
                "id": "5",
                "name": "Вина"
            },
            {
                "id": "6",
                "name": "Консервы"
            },
            {
                "id": "7",
                "name": "Соусы  и приправы"
            },
            {
                "id": "8",
                "name": "Бакалея"
            },
            {
                "id": "9",
                "name": "Крупы"
            },
            {
                "id": "10",
                "name": "Сладости"
            },
            {
                "id": "11",
                "name": "Бытовая химия"
            }
        ];

        $scope.comboboxObject = {};
        $scope.comboboxObject.currentItem = $scope.listOfTypes[0];
    });