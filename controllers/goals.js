pettycash.controller('GoalsController', function($scope, $mdDialog) {

    var goalList = this; //scope
    goalList.goals = []; //goals array on scope
    var today = Date.parse(new Date()); //today's date

    $scope.labels = ['Contributions', 'Remaining']; //chart labels
    
    $scope.options = { //chart options
        cutoutPercentage: 70,
        elements: {
            arc: {
                borderColor: '#000000'
            }
        }
    };
    //function to dynamically create modal for creating goals
    $scope.showCreateGoal = function(ev) {
        $mdDialog.show({
            template: '<md-dialog><form ng-cloak><md-toolbar><div class="md-toolbar-tools"><h2>Create New Goal</h2><span flex></span><md-button class="md-icon-button" ng-click="cancel()"><md-icon class="material-icons">close</md-icon></md-button></div></md-toolbar><md-dialog-content><div class="md-dialog-content"><div layout-gt-sm="row"><md-input-container><label>Goal</label><input type="text" ng-model="newDes" required></md-input-container></div><div layout-gt-sm="row"><md-input-container><label>Amount</label><input type="number" ng-model="newVal" required></md-input-container><md-input-container><md-datepicker ng-model="newEnd" md-placeholder="Enter date" required></md-datepicker></md-input-container><md-input-container><label>Priority</label><md-select ng-model="newPrty" required><md-optgrp><md-option ng-value="1">Low</md-option><md-option ng-value="2">Medium</md-option><md-option ng-value="3">High</md-option></md-optgrp></md-select></md-input-container></div></div></md-dialog-content><md-dialog-actions layout="row"><span flex></span><md-button ng-click="create()">Create</md-button></md-dialog-actions></form></md-dialog>',
            parent: angular.element(document.body),
            targetEvent: ev,
            scope: $scope,
            preserveScope: true,
            clickOutsideToClose:true,
            controller: function DialogController($scope, $mdDialog) { //controller to handle modal actions
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.create = function() {
                    //set new goal fields
                    goalList.newDes = $scope.newDes;
                    goalList.newVal = $scope.newVal;
                    goalList.newEnd = $scope.newEnd;
                    goalList.newPrty = $scope.newPrty;
                    //check if fields are valid, then hide modal and add goal
                    if (goalList.checkValid()) {
                        $mdDialog.hide();
                        goalList.addGoal();
                    }
                };
            }
        });
    };
    //Add goal
    goalList.addGoal = function() {
            
        var newGoal = new Goal(goalList.newDes, goalList.newEnd, goalList.newVal, goalList.newPrty); //create new goal object
        goalList.goals.push(newGoal); //add new goal to array
        saveRecords(newGoal, 'Goal'); //save new goal to cloudkit
        $scope.newDes = null;
        $scope.newVal = null;
        $scope.newEnd = null;
        $scope.newPrty = null;
    };
    //delete goals
    goalList.delete = function(goal, index) {
        goalList.goals.splice(index, 1); //remove goal from array
        deleteRecord(goal); //delete goal from cloudkit
    };
    //load goals
    goalList.loadGoals = function() {
        goalList.goals = goals; //assign reference of fetched goals array
    };
    //check if new goal is valid
    goalList.checkValid = function() {
        var end = Date.parse(goalList.newEnd); //convert chosen end date to timestamp

        if (angular.isUndefined(goalList.newDes) || goalList.newDes == null) {
            window.alert("Please enter a goal description");
        } else if (!angular.isNumber(goalList.newVal)) { //check if amount is valid number
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
            return true; //valid
        }
        return false; //invalid
    }
    //goal constructor
    function Goal(description, endDate, amount, priority) {
        this.name = Date.now().toString(); //timestamp as unique id;
        this.description = description;
        this.startDate = today; //goal created today
        this.endDate = Date.parse(endDate); //timestamp
        this.amount = amount;
        this.priority = parseInt(priority); //store priority as integer
        this.contributions = 0;
        this.data = [0, this.amount]; //chart data
        this.colors = ['#46bfbd', '#dcdcdc']; //chart colors
    }

}).filter('priority', function() { //filter for displaying priority as text
    return function(priority) {
        if (priority == 1){
            return 'Low';
        } else if (priority == 2){
            return 'Medium';
        } else {
            return 'High';
        }
    }
});
