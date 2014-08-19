'use strict';

angular.module('store.services').service('shoppingCart', function ($cookieStore, $http) {

    var putItemToCart = function (itemId, callback) {
        var shoppingCart = getItems();
        for (var key in shoppingCart) {
            if (key.toString() === itemId) {
                shoppingCart[key]++;
                $cookieStore.put('shopping-cart', shoppingCart);
                callback(getItems());
                return;
            }
        }
        shoppingCart[itemId] = 1;
        $cookieStore.put('shopping-cart', shoppingCart);
        callback(getItems());
    };

    var clearCart = function (callback) {
        var shoppingCart = {};
        $cookieStore.put('shopping-cart', shoppingCart);
        callback(getItems());
    };

    var sendCart = function (customer, callback) {
        $http({method: "POST", data: {customer: customer, order: getItems()}, url: "/sendcart"}).
            success(function (data) {
//                isAuthenticated = (data == "login");
                callback(data);
            }).error(function (data) {
                console.log(data);
//                isAuthenticated = false;
            });

        callback(getItems());
    };

    var getCart = function (callback) {
        callback(getItems());
    };

    var removeFromCart = function (itemId, callback) {
        var shoppingCart = getItems();
        delete shoppingCart[itemId];
        $cookieStore.put('shopping-cart', shoppingCart);
        callback(shoppingCart);
    };


    var decreaseNumberInCart = function (itemId, callback) {
        var shoppingCart = getItems();
        Object.keys(shoppingCart).forEach(function (key) {
            if (key == itemId) {
                if (shoppingCart[key] === 1) {
                    delete shoppingCart[itemId];
                } else {
                    shoppingCart[key]--;
                }
            }
        });
        $cookieStore.put('shopping-cart', shoppingCart);
        callback(shoppingCart);
    };

    var getNumberOfItems = function () {
        var items = getItems();
        var count = 0;
        for (var key in items) {
            count += items[key];
        }
        return count;
    };

    var getItems = function () {
        var items = $cookieStore.get('shopping-cart');
        return typeof items === 'undefined' ? {} : items;
    };

    return {
        putItemToCart: putItemToCart,
        clearCart: clearCart,
        sendCart: sendCart,
        getCart: getCart,
        removeFromCart: removeFromCart,
        getNumberOfItems: getNumberOfItems,
        decreaseNumberInCart: decreaseNumberInCart
    }

});