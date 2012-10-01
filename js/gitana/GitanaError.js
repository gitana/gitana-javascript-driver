(function(global) {
    Gitana.Error = function () {
    }
    Gitana.Error.prototype = new Error();
    Gitana.Error.prototype.constructor = Gitana.Error;
}(this));