(function(window) {
    GitanaError.prototype = new Error();
    GitanaError.prototype.constructor = GitanaError;
})(window);