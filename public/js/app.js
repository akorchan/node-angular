'use strict';

angular.module('store', ['store.controllers', 'store.services']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/store', {templateUrl: 'public/partials/store.html', controller: 'StoreController', pageKey: 'STORE'}).
            when('/about', {templateUrl: 'public/partials/about.html', controller: 'AboutController', pageKey: 'ABOUT'}).
            when('/howto', {templateUrl: 'public/partials/howto.html', controller: 'HowToController', pageKey: 'HOWTO'}).
            when('/delivery', {templateUrl: 'public/partials/delivery.html', controller: 'DeliveryController', pageKey: 'DELIVERY'}).
            when('/contactus', {templateUrl: 'public/partials/contactus.html', controller: 'ContactUsController', pageKey: 'CONTACTUS'}).
            when('/admin', {templateUrl: 'public/partials/admin.html', controller: 'AdminController', pageKey: 'ADMIN'}).
            otherwise({redirectTo: '/store'});
    }).run(function ($rootScope, $http, $route) {
        $rootScope.$on("$routeChangeSuccess",
            function (angularEvent, currentRoute, previousRoute) {
                $("li[class*='pagekey']").toggleClass("active", false);
                $(".pagekey_" + currentRoute.pageKey).toggleClass("active", true);
            });

    });

/** services module initialization, allows adding services to module in multiple files */
angular.module('store.services', [/*'ngCookies'*/]);

/** controllers module initialization, allows adding services to module in multiple files */
angular.module('store.controllers', ['ui.bootstrap', 'store.services']);