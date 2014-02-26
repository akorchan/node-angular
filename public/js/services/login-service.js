'use strict';

/** store items service */
angular.module('store.services').service('LoginService', function ($http) {

    var isAuthenticated;

    var isLoggedIn = function () {
        return isAuthenticated;
    };

    var login = function (username, password, callback) {
        $http({method: "POST", data: JSON.stringify({user: username, pass: password}), url: "/user/login"}).
            success(function (data) {
                isAuthenticated = (data == "login");
                callback(data);
            }).error(function (data) {
                console.log(data);
                isAuthenticated = false;
            });
    };

    var logout = function (callback) {
        $http({method: "POST", data: {}, url: "/user/logout"}).
            success(function (data) {
                isAuthenticated = (data != "logout");
                callback(data);
            }).error(function (data) {
                console.log(data);
                isAuthenticated = true;
            });
    };

    return {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn
    };

});