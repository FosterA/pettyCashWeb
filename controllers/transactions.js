angular.module('PettyCash').controller('TransactionsController', function() {
  
    var transList = this; //scope
    transList.transactions = []; //create transactions array on scope
    var today = Date.parse(new Date()); //today's date
 
    transList.addTransaction = function() {
        var newTransaction = new Transaction(tranDes, tranVal); //create new transaction object
        transList.transactions.unshift(newTransaction); //add new transaction to front of array
        saveRecord(newTransaction, 'Transaction'); //save new transaction to cloudkit
    };
    
    transList.loadTransactions = function() {
        angular.copy(transactions, transList.transactions); //copy fetched transactions to controller
    }
    
    transList.delete = function(transaction, index) {
        transList.transactions.splice(index, 1); //remove transaction from array
        deleteRecord(transaction); //delete transaction from cloudkit
    }
    
    function Transaction(description, amount) {
        this.name = Date.now().toString(); //timestamp as unique id
        this.description = description;
        this.date = today; //transaction occured today
        this.amount = amount;
    }
    
});
