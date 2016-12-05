var pettycash = angular.module('PettyCash', ['ngMaterial', 'ngMessages', 'ngRoute', 'chart.js', 'angular-plaid-link'])

.config([
    'plaidLinkProvider',

    function(plaidLinkProvider) {
        plaidLinkProvider.init({
            clientName: 'PettyCash',
            env: 'tartan',
            key: 'test_key',
            product: 'auth'
        });
    }
])

.controller('mainCtrl', [
    '$scope',
    'plaidLink',

    function($scope, plaidLink) {
        $scope.token = '';
        $scope.plaidIsLoaded = plaidLink.isLoaded;

        plaidLink.create({
            onSuccess: function(token, metadata) {
                $scope.token = token;

                console.log("token sent");

            },
            onExit: function() {
                console.log('user closed');
            }


        });

        $scope.openPlaid = function(bankType) {
            plaidLink.open(bankType);
        };

    }
])

.controller('navController', function() {
  //setting default home tab value on global controller
  this.currentNavItem = "3";
  this.AccountLinked = "0";
});
