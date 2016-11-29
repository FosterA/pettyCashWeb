var pettycash = angular.module('PettyCash', ['ngMaterial', 'ngRoute']);
pettycash.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    .when("/expenses", {
        templateUrl : "expenses.html"
    })
});
