var container = CloudKit.getDefaultContainer();
var privateDB = container.privateCloudDatabase;
// All CRUD operations for Cloudkit record storage
function saveRecords(records, recordType) {

    var query;
    
    if (recordType == 'Transaction') {
        query = [];
        
        angular.forEach(records, function(record) {
            var rec = {
                recordName: record.name,
                recordType: recordType,
                fields: {
                    amount: {value: record.amount},
                    description: {value: record.description},
                    date: {value: record.date},
                    goal: {
                        value: {
                            recordName: record.reference,
                            action: 'NONE',
                            zoneID: {
                                zoneName: 'savings',
                                ownerRecordName: user
                            }
                        }
                    }
                }
            };
            
            query.push(rec);
        });
    } else if (recordType == 'Goal') {
        query = {
            recordName: records.name,
            recordType: recordType,
            fields: {
                amount: {value: records.amount},
                description: {value: records.description},
                endDate: {value: records.endDate},
                startDate: {value: records.startDate},
                priority: {value: records.priority}
            }
        };
    }

    privateDB.saveRecords(query, {zoneID: 'savings'}).then(function(response) {
        if (response.hasErrors) {
            var ckError = response.errors[0];
            throw ckError;
        } else {
            var recordResponse = response.records[0];
        }
    });

}
// delete records when the x button is clicked
function deleteRecord(removed) {

    privateDB.deleteRecords(removed.name, {zoneID: 'savings'}).then(function(response) {
        if (response.hasErrors) {
            var ckError = response.errors[0];
            throw ckError;
        } else {
            var recordResponse = response.records[0];
        }
    });

}
// declare arrays for goals and transactions
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

    privateDB.performQuery(goalQuery, {zoneID: 'savings'}).then(function(response) {
        if (response.hasErrors) {
            throw response.errors[0];
        } else {
            angular.forEach(response.records, function(record, key) {
                var goal = {name:record.recordName, description:record.fields.description.value, startDate:record.fields.startDate.value, endDate:record.fields.endDate.value, amount:record.fields.amount.value, priority:record.fields.priority.value, contributions:0, data:[0, 0], labels:["Contributions", "Remaining"], colors:['#46bfbd', '#dcdcdc']};
                goals.push(goal);
            });
            setTimeout(function() {
                document.getElementById('loadGoals').click();
            }, 250);
        }
    });

    privateDB.performQuery(transactionQuery, {zoneID: 'savings'}).then(function(response) {
        if (response.hasErrors) {
            throw response.errors[0];
        } else {
            angular.forEach(response.records, function(record, key) {
                var transaction = {name:record.recordName, description:record.fields.description.value, date:record.fields.date.value, amount:record.fields.amount.value, reference:record.fields.goal.value.recordName};
                transactions.push(transaction);
            });
            setTimeout(function() {
                document.getElementById('loadTrans').click();
            }, 250);
        }
    });

}
