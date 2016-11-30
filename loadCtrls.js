var pettycash = angular.module('PettyCash', ['ngMaterial', 'ngRoute']);
pettycash.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    .when("/expenses", {
        templateUrl : "expenses.html"
    })
    .otherwise({ redirectTo: '/'});
}).controller('navController', function() {
  this.currentNavItem = "Home";
});;
