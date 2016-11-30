pettycash.controller('ExpensesController', ['$scope', '$http', function($scope, $http) {

    var today = Date.parse(new Date()); //today's date
    var url = "http://ec2-54-70-114-249.us-west-2.compute.amazonaws.com:3000/authenticate";

    $http({
        method: 'POST',
        url: url
    }).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
        $scope.accounts = response.data.accounts;
        $scope.expenses = response.data.transactions;

    }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
        console.log("failure");
    });
}]).filter('deposit', function() { //filter for displaying priority as text
    return function(expenseAmt) {
        if (expenseAmt < 0) {
          return expenseAmt.toString().slice(1);
        } else {
          return expenseAmt;
        }
    }
});
