var pettycash = angular.module('PettyCash', ['ngMaterial', 'ngRoute', 'chart.js'])

.controller('navController', function() {
  //setting default home tab value on global controller
  this.currentNavItem = "1";
});
