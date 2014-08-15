'use strict';

angular.module('store.services').service('shoppingCart', function ($cookieStore) {

    var putItemToCart = function (itemId, callback) {
        var shoppingCart = $cookieStore.get('shopping-cart');
        if (typeof shoppingCart === 'undefined') {
            shoppingCart = [];
        }
        shoppingCart.push(itemId);
        $cookieStore.put('shopping-cart', shoppingCart);
        shoppingCart = $cookieStore.get('shopping-cart');
        callback(typeof shoppingCart === 'undefined' ? [] : shoppingCart);
    };

    var clearCart = function (callback) {
        var shoppingCart = [];
        $cookieStore.put('shopping-cart', shoppingCart);
        shoppingCart = $cookieStore.get('shopping-cart');
        callback(typeof shoppingCart === 'undefined' ? [] : shoppingCart);
    };

    var getCart = function (callback) {
        var shoppingCart = $cookieStore.get('shopping-cart');
        callback(typeof shoppingCart === 'undefined' ? [] : shoppingCart);
    };

    var removeFromCart = function (itemId, callback) {
        var shoppingCart = $cookieStore.get('shopping-cart');
        if (typeof shoppingCart === 'undefined') {
            callback([]);
        } else {
            var index = shoppingCart.indexOf(itemId);
            if (index > -1) {
                shoppingCart.splice(index, 1);
            }
            callback(shoppingCart);
        }
    };

    return {
        putItemToCart: putItemToCart,
        clearCart: clearCart,
        getCart: getCart,
        removeFromCart: removeFromCart
    }

});