var pettycash = angular.module('PettyCash', ['ngMaterial', 'ngRoute', 'chart.js'])
// pettycash.config(function($routeProvider) {
//     $routeProvider
//     .when("/", {
//         templateUrl : "home.html"
//     })
//     .when("/expenses", {
//         templateUrl : "expenses.html"
//     })
//     .otherwise({ redirectTo: '/'});
.controller('navController', function() {
  this.currentNavItem = "1";
});
