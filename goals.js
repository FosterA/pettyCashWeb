angular.module('PettyCash').controller('GoalsController', function() {
    
    var goalList = this;
    goalList.goals = [];
    var today = Date.parse(new Date());
 
    goalList.addGoal = function() {
        
        var end = Date.parse(goalList.newEnd);
        
        if (!angular.isNumber(goalList.newVal)) {
            window.alert("Invalid Amount");
        } else if (goalList.newVal == 0) {
            window.alert("Amount must be greater than $0.00");
        } else if (isNaN(end)){
            window.alert("Invalid Date");
        } else if (end <= today) {
            window.alert("Date must be future date");
        } else if (isNaN(parseInt(goalList.newPrty))) {
            window.alert("Please Select Priority");
        } else {
            var newGoal = new Goal(goalList.newDes, end, goalList.newVal, goalList.newPrty);
            goalList.goals.push(newGoal);
            saveGoal(newGoal);
            cleanForm();
        }
    };
 
    goalList.remaining = function() {
      var count = 0;
      angular.forEach(goalList.goals, function(goal) {
        count += goal.done ? 0 : 1;
      });
      return count;
    };
 
    goalList.archive = function() {
      var oldGoals = goalList.goals;
      goalList.goals = [];
      angular.forEach(oldGoals, function(goal) {
        if (!goal.done) goalList.goals.push(goal);
      });
    };
    
    goalList.loadGoals = function() {
        goalList.goals = goals;
    }
    
    goalList.delete = function(goal) {
        var index = goalList.goals.indexOf(goal);
        goalList.goals.splice(index, 1);
        deleteGoal(goal);
    }
    
    function Goal(description, endDate, amount, priority) {
        this.name = '';
        this.description = description;
        this.startDate = today;
        this.endDate = endDate;
        this.amount = amount;
        this.priority = parseInt(priority);
        this.done = false;
    }
    
    function cleanForm() {
        goalList.newDes = '';
        goalList.newEnd = '';
        goalList.newVal = '';
        goalList.newPrty = '';
    }
    
}).filter('priority', function() {
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
