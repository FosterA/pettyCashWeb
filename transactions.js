angular.module('PettyCash').controller('TransactionsController', function() {
    var transactions = this;
    transactions.trans = [{
        id:'1',
        description:'test transaction',
        date:'11-26-16',
        amount:1000,
        done:false}];

    transactions.addTran = function() {
      transactions.trans.push({
                id:'2',
                description:transactions.tranDes,
                date:transactions.tranDate,
                amount:transactions.tranVal,
                done:false});

      transactions.tranDes = '';
      transactions.tranVal = 0;
      transactions.tranDate = '';
    };

    transactions.remaining = function() {
      var count = 0;
      angular.forEach(transactions.trans, function(tran) {
        count += tran.done ? 0 : 1;
      });
      return count;
    };

    transactions.archive = function() {
      var oldTrans = transactions.trans;
      transactions.trans = [];
      angular.forEach(oldTrans, function(tran) {
        if (!tran.done) transactions.trans.push(tran);
      });
    };
});
