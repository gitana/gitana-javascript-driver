var Transaction = require('./../transaction');

var transaction = {
  for: function(branch) {
    return new Transaction(branch);
  }
};

module.exports = function(Gitana) {

  Gitana.Transaction = Transaction;

  Gitana.createTransaction = function(branch) {
    return branch ? transaction.for(branch) : transaction;
  };

};
