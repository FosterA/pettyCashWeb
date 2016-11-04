var container = CloudKit.getDefaultContainer();
var privateDB = container.privateCloudDatabase;

function saveGoal(newGoal) {
    
    var record = {
        recordName: newGoal.name,
        recordType: 'Goal',
        fields: {
            amount: {
                value: newGoal.amount
            },
            description: {
                value: newGoal.description
            },
            endDate: {
                value: newGoal.endDate
            },
            priority: {
                value: newGoal.priority
            }
        }
    };
    
    
    privateDB.saveRecords(record).then(function(response) {
        if (response.hasErrors) {
            var ckError = response.errors[0];
            throw ckError;
        } else {
            var record = response.records[0];
        }
    });
    
}

function deleteGoal(removed) {
    
    privateDB.deleteRecords(removed.name).then(function(response) {
        if (response.hasErrors) {
            var ckError = response.errors[0];
            throw ckError;
        } else {
            var record = response.records[0];
        }
    });
    
}

var goals = [];

function fetchGoals() {
    
    var goalQuery = {
        recordType: 'Goal',
        sortBy: [{
            fieldName: 'priority',
            ascending: false
        }]  
    };

    privateDB.performQuery(goalQuery).then(function(response) {
        if (response.hasErrors) {
            throw response.errors[0];
        } else {
            angular.forEach(response.records, function(record, key) {
                var goal = {name:record.recordName, description:record.fields.description.value, startDate:new Date(), endDate:record.fields.endDate.value, amount:record.fields.amount.value, priority:record.fields.priority.value, done:false}
                goals.push(goal);
            });
        }
    });


    setTimeout(function(){
        document.getElementById('load').click();
    }, 1000);
    
}

fetchGoals();

setTimeout(function(){
    document.getElementById('goals').style.display = "inline";
}, 1000);