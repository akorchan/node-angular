'use strict';

angular.module('store', ['store.controllers', 'store.services']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/store', {templateUrl: 'public/partials/store.html', controller: 'StoreController', pageKey: 'STORE'}).
            when('/store/:itemId', {templateUrl: 'public/partials/item-view.html', controller: 'ItemController', pageKey: 'STORE'}).
            when('/cook', {templateUrl: 'public/partials/cook.html', controller: 'CookController', pageKey: 'COOK'}).
            when('/howto', {templateUrl: 'public/partials/howto.html', controller: 'HowToController', pageKey: 'HOWTO'}).
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

/** controllers module initialization, allows adding controllers to module in multiple files */
angular.module('store.controllers', ['ui.bootstrap', 'store.services', 'store.directives']);

/** directives module initialization, allows adding directives to module in multiple files */
angular.module('store.directives', []);