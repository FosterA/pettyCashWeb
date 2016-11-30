pettycash.controller('TransactionsController', function() {
  
    var transList = this; //scope
    transList.transactions = []; //create transactions array on scope
    var today = Date.parse(new Date()); //today's date
 
    transList.addTransaction = function() {
        
        var selectBox = document.getElementById('goalSelect'); //get goal select box
        var reference;
        
        if (selectBox.options.length == 0) {
            reference = "NoRef"; //if no goals available, set no reference
        } else {
            reference = selectBox.options[selectBox.selectedIndex].value; //get reference from selected option 
        }
        
        var tra = 0;
        angular.forEach(goals, function(goal) {
            tra += goal.amount - goal.contributions;   
        });
        
        angular.forEach(goals, function(goal) {
            var daysRemain = Math.round((goal.endDate - today)/(1000*60*60*24));
            var ica = (tra/(daysRemain*(goal.amount-goal.contributions)))*goal.priority*tranVal;
            reference = goal.name;
           
            var newTransaction = new Transaction(tranDes, ica, reference); //create new transaction object
            transList.transactions.unshift(newTransaction); //add new transaction to front of array
            saveRecord(newTransaction, 'Transaction'); //save new transaction to cloudkit
        });
        
        transList.setContributions(); //reload current contributions
        
    };
    
    transList.delete = function(transaction, index) {
        transList.transactions.splice(index, 1); //remove transaction from array
        deleteRecord(transaction); //delete transaction from cloudkit
        
        angular.forEach(goals, function(goal) {
            if (goal.name == transaction.reference) {
                goal.contributions -= transaction.amount; //remove contribution
            } 
        });
        transList.setContributions(); //reload contributions
    };
    
    transList.setContributions = function() {
        angular.forEach(goals, function(goal) {
            goal.contributions = 0; //initialize to 0 to prevent duplications
            angular.forEach(transList.transactions, function(transaction) {
                if (transaction.reference == goal.name) { //check goal's name matches reference
                    goal.contributions += transaction.amount; //increment contributions
                } 
            });
            
            goal.data[0] = goal.contributions; //update chart data contributions
            goal.data[1] = goal.amount-goal.contributions; //update chart data remaining
            
            if (goal.data[1] <= 0) {
                goal.data[1] = 0; //set remaining to 0
                goal.colors[0] = '#5bef25';
                
                var selectBox = document.getElementById('goalSelect'); //get goal select box
                angular.forEach(selectBox.options, function(option) {
                    if (option.value == goal.name) {
                        option.remove(); //remove option if remaining 0
                    }
                });
            } else {
                goal.colors[0] = '#46bfbd';
            }
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
