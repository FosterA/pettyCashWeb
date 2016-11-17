pettycash.controller('ExpensesController', function() {
  
    var expenseList = this; //scope
    expenseList.expenses = []; //create expenses array on scope
    var today = Date.parse(new Date()); //today's date
    
    expenseList.loadExpenses = function() {
        
        var url = "http://ec2-54-70-114-249.us-west-2.compute.amazonaws.com:3000/authenticate";
        
        $http({
            method: 'POST',
            url: url
        }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
            console.log("success");
        }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
            console.log("failure");
        });
    };
    
    expenseList.loadExpenses();
    
});