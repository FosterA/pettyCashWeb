var pettycash = angular.module('PettyCash', ['ngMaterial', 'ngMessages', 'ngRoute', 'chart.js'])

.controller('navController', function() {
  //setting default home tab value on global controller
  this.currentNavItem = "1";
});
