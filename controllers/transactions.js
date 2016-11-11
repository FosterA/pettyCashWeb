angular.module('PettyCash').controller('TransactionsController', function() {

    var transList = this;
    transList.transactions = [];
    var today = Date.parse(new Date());
 
    transList.addTransaction = function() {
        
        var newTransaction = new Transaction(tranDes, tranVal);
        transList.transactions.push(newTransaction);
        saveRecord(newTransaction, 'Transaction');
        cleanForm();

    };
 
    transList.remaining = function() {
      var count = 0;
      angular.forEach(transList.goals, function(transaction) {
        count += transaction.done ? 0 : 1;
      });
      return count;
    };
 
    transList.archive = function() {
      var oldTransactions = transList.transactions;
      transList.transactions = [];
      angular.forEach(oldTransactions, function(transaction) {
        if (!transaction.done) transList.transactions.push(transaction);
      });
    };
    
    transList.loadTransactions = function() {
        angular.copy(transactions, transList.transactions);
    }
    
    function Transaction(description, amount) {
        this.name = Date.now().toString();
        this.description = description;
        this.date = today;
        this.amount = amount;
    }
    
    function cleanForm() {
        document.getElementById('goalForm').reset();
    }
    
});
