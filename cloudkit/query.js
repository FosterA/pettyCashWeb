var container = CloudKit.getDefaultContainer();
var privateDB = container.privateCloudDatabase;

function saveRecord(record, recordType) {
    
    var query;
    
    if (recordType == 'Goal') {
        query = {
            recordName: record.name,
            recordType: recordType,
            fields: {
                amount: {
                    value: record.amount
                },
                description: {
                    value: record.description
                },
                endDate: {
                    value: record.endDate
                },
                startDate: {
                    value: record.startDate
                },
                priority: {
                    value: record.priority
                }
            }
        };
    } else if (recordType == 'Transaction') {
        query = {
            recordName: record.name,
            recordType: recordType,
            fields: {
                amount: {
                    value: record.amount
                },
                description: {
                    value: record.description
                },
                date: {
                    value: record.date
                }
            }
        };
    }
    
    privateDB.saveRecords(query).then(function(response) {
        if (response.hasErrors) {
            var ckError = response.errors[0];
            throw ckError;
        } else {
            var recordResponse = response.records[0];
        }
    });
    
}

function deleteRecord(removed) {
    
    privateDB.deleteRecords(removed.name).then(function(response) {
        if (response.hasErrors) {
            var ckError = response.errors[0];
            throw ckError;
        } else {
            var recordResponse = response.records[0];
        }
    });
    
}

var goals = [];
var transactions = [];

function fetchRecords() {
    
    var goalQuery = {
        recordType: 'Goal',
        sortBy: [{
            fieldName: 'priority',
            ascending: false
        }]  
    };
    
    var transactionQuery = {
        recordType: 'Transaction',
        sortBy: [{
            fieldName: 'date',
            ascending: false
        }]
    }

    privateDB.performQuery(goalQuery).then(function(response) {
        if (response.hasErrors) {
            throw response.errors[0];
        } else {
            angular.forEach(response.records, function(record, key) {
                var goal = {name:record.recordName, description:record.fields.description.value, startDate:record.fields.startDate.value, endDate:record.fields.endDate.value, amount:record.fields.amount.value, priority:record.fields.priority.value}
                goals.push(goal);
            });
        }
    });
    
    privateDB.performQuery(transactionQuery).then(function(response) {
        if (response.hasErrors) {
            throw response.errors[0];
        } else {
            angular.forEach(response.records, function(record, key) {
                var transaction = {name:record.recordName, description:record.fields.description.value, date:record.fields.date.value, amount:record.fields.amount.value}  
                transactions.push(transaction);
            });
        }
    });


    setTimeout(function(){
        document.getElementById('loadGoals').click();
        document.getElementById('loadTrans').click();
    }, 1500);
    
}