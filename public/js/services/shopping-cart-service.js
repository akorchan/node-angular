'use strict';

angular.module('store.services').service('shoppingCart', function ($cookieStore) {

    var putItemToCart = function (itemId, callback) {
        var shoppingCart = getItems();
        shoppingCart.push(itemId);
        $cookieStore.put('shopping-cart', shoppingCart);
        callback(getItems());
    };

    var clearCart = function (callback) {
        var shoppingCart = [];
        $cookieStore.put('shopping-cart', shoppingCart);
        callback(getItems());
    };

    var getCart = function (callback) {
        callback(getItems());
    };

    var removeFromCart = function (itemId, callback) {
        var shoppingCart = getItems();
        var index = shoppingCart.indexOf(itemId);
        if (index > -1) {
            shoppingCart.splice(index, 1);
        }
        $cookieStore.put('shopping-cart', shoppingCart);
        callback(shoppingCart);
    };

    var getNumberOfItems = function () {
        return getItems().length;
    };

    var getItems = function () {
        var items = $cookieStore.get('shopping-cart');
        return typeof items === 'undefined' ? [] : items;
    };

    return {
        putItemToCart: putItemToCart,
        clearCart: clearCart,
        getCart: getCart,
        removeFromCart: removeFromCart,
        getNumberOfItems: getNumberOfItems
    }

});