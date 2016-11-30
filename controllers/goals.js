pettycash.controller('GoalsController', function($scope) {
    
    var goalList = this; //scope
    goalList.goals = []; //goals array on scope
    var today = Date.parse(new Date()); //today's date
    
    $scope.options = {
        maintainAspectRation: true,
        responsive: true
    };
    
    $scope.colors = ['#46bfbd', '#dcdcdc'];
 
    goalList.addGoal = function() {
        
        var end = Date.parse(goalList.newEnd); //convert chosen end date to timestamp
        
        if (!angular.isNumber(goalList.newVal)) { //check if amount is valid number
            window.alert("Invalid Amount");
        } else if (goalList.newVal == 0) {
            window.alert("Amount must be greater than $0.00");
        } else if (isNaN(end)){ //check if end date is valid date
            window.alert("Invalid Date");
        } else if (end <= today) { //check if end date is before today's date
            window.alert("Date must be future date");
        } else if (isNaN(parseInt(goalList.newPrty))) { //check if priority selected
            window.alert("Please Select Priority");
        } else {
            var name = Date.now().toString(); //timestamp as unique id
            var newGoal = new Goal(name, goalList.newDes, end, goalList.newVal, goalList.newPrty); //create new goal object
            goalList.goals.push(newGoal); //add new goal to array
            saveRecord(newGoal, 'Goal'); //save new goal to cloudkit
            document.getElementById('goalForm').reset(); //clear goal form inputs
            
            var selectBox = document.getElementById('goalSelect'); //get goal select box
            selectBox.options.add(new Option(goalList.newDes, name)); //add new goal to options of select box
        }
    };
    
    goalList.delete = function(goal, index) {
        goalList.goals.splice(index, 1); //remove goal from array
        deleteRecord(goal); //delete goal from cloudkit
        
        var selectBox = document.getElementById('goalSelect'); //get goal select box
        selectBox.options[index].remove(); //remove deleted goal
    };
    
    goalList.loadGoals = function() {
        goalList.goals = goals; //assign reference of fetched goals array
        
        var selectBox = document.getElementById('goalSelect'); //get goal select box
        angular.forEach(goalList.goals, function(goal) {
            selectBox.options.add(new Option(goal.description, goal.name)); //add goals to options of select box
        });
    };
    
    function Goal(name, description, endDate, amount, priority) {
        this.name = name;
        this.description = description;
        this.startDate = today; //goal created today
        this.endDate = endDate;
        this.amount = amount;
        this.priority = parseInt(priority); //store priority as integer
        this.contributions = 0;
        this.labels = ["Contributions", "Remaining"]; //chart labels
        this.data = [0, this.amount]; //chart data
    }
    
}).filter('priority', function() { //filter for displaying priority as text
    return function(priority) {
        if (priority == 1){
            return 'low';
        } else if (priority == 2){
            return 'medium';
        } else {
            return 'high';
        }
    }
});
