pettycash.controller('TransactionsController', function() {
  
    var transList = this; //scope
    transList.transactions = []; //create transactions array on scope
    var today = Date.parse(new Date()); //today's date
 
    transList.addTransaction = function() {
        
        var selectBox = document.getElementById('goalSelect'); //get goal select box
        var reference = selectBox.options[selectBox.selectedIndex].value; //get reference
        
        var newTransaction = new Transaction(tranDes, tranVal, reference); //create new transaction object
        transList.transactions.unshift(newTransaction); //add new transaction to front of array
        saveRecord(newTransaction, 'Transaction'); //save new transaction to cloudkit
        
        transList.setContributions(); //reload current contributions
        
    };
    
    transList.delete = function(transaction, index) {
        transList.transactions.splice(index, 1); //remove transaction from array
        deleteRecord(transaction); //delete transaction from cloudkit
    };
    
    transList.setContributions = function() {
        angular.forEach(goals, function(goal) {
            goal.contributions = 0; //initialize to 0 to prevent duplications
            angular.forEach(transList.transactions, function(transaction) {
                if (transaction.reference == goal.name) { //check goal's name matches reference
                    goal.contributions += transaction.amount; //increment contributions
                } 
            }); 
        });
    };
    
    transList.loadTransactions = function() {
        transList.transactions = transactions; //assign reference of fetched goals array
        transList.setContributions(); //set contributions
    };
    
    function Transaction(description, amount, reference) {
        this.name = Date.now().toString(); //timestamp as unique id
        this.description = description;
        this.date = today; //transaction occured today
        this.amount = amount;
        this.reference = reference //selected goal reference
    }
    
});
