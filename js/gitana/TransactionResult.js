(function(window) {

  var Gitana = window.Gitana;

  var TransactionResult = function(o) {
    for (var i in o) {
      this[i] = o;
    }
  };

  Gitana.TransactionResult = TransactionResult;

})(window);
