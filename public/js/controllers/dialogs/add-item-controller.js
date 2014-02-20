'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AddItemController', function ($scope, $modalInstance, $http, $route, selected, storeItems) {

        $scope.downloadSize = "Предпочтительный размер изображения: 20-50 КБ";

        $scope.files = [];

        function addEmptyFileSelector() {
            var file = {};
            $scope.files.push(file);
        }

        addEmptyFileSelector();

        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                var file = $scope.files[$scope.files.length - 1];
                file.image = args.file;
                file.name = args.file.name + " (" + (args.file.size / 1024).toFixed(0) + " КБ)";
                file.id = $scope.files.length - 1;
                addEmptyFileSelector();
            });
        });

        $scope.newItem = {};

        $scope.isEdit = typeof selected !== "undefined";

        if (selected) {
            storeItems.findItemById(selected, function (data) {
                $scope.selectedItem = data;
                $scope.newItem._id = data._id;
                $scope.newItem.name = data.name;
                $scope.newItem.description = data.description;
                $scope.newItem.price = data.price;
                $scope.newItem.images = data.images;
                $scope.comboboxObject.currentItem = $scope.listOfTypes[data.type - 1];
            });
        }
//        $scope.selectedItem = selectedItem;
//        $scope.selected = {
//            item: null
//        };

        $scope.ok = function () {
            $scope.newItem.type = $scope.comboboxObject.currentItem.id; //should be removed
            storeItems.addOrUpdateItem($scope.newItem,
                $scope.files.
                    map(function (file) {
                        return file.image;
                    }).filter(function (element) {
                        return typeof element !== "undefined"
                    }),
                function () {
                    $route.reload();
                    $modalInstance.close(/*$scope.selected.item*/);
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.removeNewlyAddedImage = function (id) {
            $scope.files = $scope.files.filter(function (element) {
                return element.id !== id;
            });

        };

        $scope.removeExistedImage = function (id) {
            $scope.newItem.images = $scope.newItem.images.filter(function (element) {
                return element !== id;
            });
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
                "name": "Консервированные продукты"
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
            },
            {
                "id": "12",
                "name": "Органические продукты"
            },
            {
                "id": "13",
                "name": "Детское питание"
            },
            {
                "id": "14",
                "name": "Морепродукты"
            },
            {
                "id": "15",
                "name": "Кофе и чай"
            },
            {
                "id": "16",
                "name": "Органические продукты"
            },
            {
                "id": "17",
                "name": "Элитный алкоголь"
            },
            {
                "id": "18",
                "name": "Сувениры"
            }
        ];

        $scope.comboboxObject = {};
        $scope.comboboxObject.currentItem = $scope.listOfTypes[0];
    });