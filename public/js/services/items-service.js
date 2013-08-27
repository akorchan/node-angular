'use strict';

/** store items service */
angular.module('store.services').service('storeItems', function ($http) {

    /**
     * Get all available items.
     * @param callback
     */
    var getAllItems = function (callback) {
        $http({method: "GET", data: {}, url: "/items"}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    /**
     * Find item by id.
     * @param callback
     */
    var findItemById = function (callback) {

    };


    /**
     * Add new item.
     * @param callback
     */
    var addItem = function (callback) {

    };

    /**
     * Update current item.
     * @param callback
     */
    var updateItem = function (callback) {

    };

    /**
     * Delete item.
     * @param callback
     */
    var deleteItem = function (callback) {

    };

    return {
        getAllItems: getAllItems,
        findItemById: findItemById,
        addItem: addItem,
        updateItem: updateItem,
        deleteItem: deleteItem
    };

});