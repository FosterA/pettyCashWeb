//Controller to help with transactions and contributions
pettycash.controller('TransactionsController', function($scope, $mdDialog) {
  
    var transList = this; //scope
    transList.transactions = []; //create transactions array on scope
    var today = Date.parse(new Date()); //today's date
 
    transList.addTransaction = function() {  

        var reference;
        
        if (goals.length == 0) {
            reference = "NoRef"; //if no goals available, set no reference
        }
        
        var tra = 0;
        angular.forEach(goals, function(goal) {
            tra += goal.amount - goal.contributions;  //calculate total remaining amount 
        });
        
        var upcoming = []; // transactions about to be saved to db
        tca = 0; //total contribution amount
        
        angular.forEach(goals, function(goal) {
            var amountRemain = goal.amount - goal.contributions; //amount remaining for goal
            
            if (amountRemain > 0) { //only contribute if amount remaining
                var ica = transList.calcContributions(goal, tra, amountRemain); //calculate individual contribution amount foreach goal
                tca += ica;
                reference = goal.name; //set transaction reference
                
                var newTransaction = new Transaction(tranDes, ica, reference); //create new transaction object
                transList.transactions.unshift(newTransaction); //add new transaction to front of array
                upcoming.push(newTransaction); //populate upcoming saved records array
            }
        });
        
        if (upcoming.length > 0) {
            saveRecords(upcoming, 'Transaction'); //save array of transactions
        }
        
        transList.setContributions(); //reload current contributions
    };
    
    transList.delete = function(transaction, index) {
        transList.transactions.splice(index, 1); //remove transaction from array
        deleteRecord(transaction); //delete transaction from cloudkit
        
        transList.setContributions(); //reload contributions
    };
    
    transList.calcContributions = function(goal, tra, amountRemain) {
        var daysRemain = Math.round((goal.endDate - today)/(1000*60*60*24)); //days until goal end date
        var ica = (tra/(daysRemain*(goal.amount-goal.contributions)))*goal.priority*tranVal; //calculate individual contribution amount

        if (ica > amountRemain) {
            ica = amountRemain; //if ica greater than amount remaining, set ica to amount remaining
        }
        
        return parseFloat(ica.toFixed(2));
    };
    
    transList.setContributions = function() {
        angular.forEach(goals, function(goal) {
            goal.contributions = 0; //initialize to 0 to prevent duplications
            angular.forEach(transList.transactions, function(transaction) {
                if (transaction.reference == goal.name) { //check goal's name matches reference
                    goal.contributions += transaction.amount; //increment contributions
                } 
            });
            transList.updateChart(goal);
        });
    };
    //update contributions chart
    transList.updateChart = function (goal) {
        goal.data[0] = goal.contributions; //update chart data contributions
        goal.data[1] = goal.amount-goal.contributions; //update chart data remaining
            
        if (goal.data[1] <= 0) {
            goal.data[1] = 0; //set remaining to 0
            goal.colors[0] = '#5bef25';
        } else {
            goal.colors[0] = '#46bfbd';
        }
    };
    
    transList.loadTransactions = function() {
        transList.transactions = transactions; //assign reference of fetched goals array
        transList.setContributions(); //set contributions
    };
    
    function Transaction(description, amount, reference) {
        this.name = Date.now().toString() + Math.random().toString(); //timestamp as unique id
        this.description = description;
        this.date = today; //transaction occured today
        this.amount = amount;
        this.reference = reference //selected goal reference
    }
    
});
