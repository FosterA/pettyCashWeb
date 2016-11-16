pettycash.controller('TransactionsController', function() {
  
    var transList = this; //scope
    transList.transactions = []; //create transactions array on scope
    var today = Date.parse(new Date()); //today's date
 
    transList.addTransaction = function() {
        var newTransaction = new Transaction(tranDes, tranVal); //create new transaction object
        transList.transactions.unshift(newTransaction); //add new transaction to front of array
        saveRecord(newTransaction, 'Transaction'); //save new transaction to cloudkit
        goals[0].contributions += tranVal;
    };
    
    transList.delete = function(transaction, index) {
        transList.transactions.splice(index, 1); //remove transaction from array
        deleteRecord(transaction); //delete transaction from cloudkit
    };
    
    transList.setContributions = function() {
        angular.forEach(goals, function(goal) {
            angular.forEach(transList.transactions, function(transaction) {
                if (transaction.reference == goal.name) {
                    goal.contributions += transaction.amount;
                } 
            }); 
        });
    };
    
    transList.loadTransactions = function() {
        transList.transactions = transactions; //assign reference of fetched goals array
        transList.setContributions();
    };
    
    function Transaction(description, amount) {
        this.name = Date.now().toString(); //timestamp as unique id
        this.description = description;
        this.date = today; //transaction occured today
        this.amount = amount;
        this.reference = goals[0].name;
    }
    
});
