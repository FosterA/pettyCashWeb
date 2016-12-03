pettycash.controller('ExpensesController', ['$scope', '$http', function($scope, $http) {
    // The Expenses controller makes a request to our AWS Application NodeJS server and retrieves a list of mocked transaction data
    // The reason for needing an application middle-man server is so that if this project is continued, that server can be fully implemented to exchange actual client data from Plaid
    var today = Date.parse(new Date()); //today's date
    var url = "http://ec2-54-70-114-249.us-west-2.compute.amazonaws.com:3000/authenticate";
    //CORS friendly Angular $http service call to retrieve JSON data
    $http({
        method: 'POST',
        url: url
    }).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
        $scope.accounts = response.data.accounts;
        $scope.expenses = response.data.transactions;
        console.log($scope.expenses);

    }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
        console.log("failure");
    });
    
    $scope.getIcon = function(expense) {
        var icon = 'attach_money';
        if (angular.isDefined(expense.category)) {
            angular.forEach(expense.category, function(category) {
                if (category == "Shops") {
                    icon = 'shopping_cart';
                } else if (category == "Restaurants") {
                    icon = 'restaurant';
                } else if (category == "Account Transfer") {
                    icon = 'compare_arrows';
                }
            });
        } else if (expense.name == "Golden Crepes") {
            icon = 'restaurant';
        }
        return icon;  
    };
}]).filter('deposit', function() {
  //custom built angular filter for displaying priority as text w/o the negative symbol for deposits
    return function(expenseAmt) {
        if (expenseAmt < 0) {
          return expenseAmt.toString().slice(1);
        } else {
          return expenseAmt;
        }
    }
});
