(function(window) {

    var Gitana = window.Gitana;

    var DEFAULT_CONCURRENCY = 2;

    var chunk = function(array, size) {
        var chunks = [];
        for (var i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    };

    var Queue = function(concurrency) {
        this.concurrency = concurrency || DEFAULT_CONCURRENCY;
        this.work = [];
    };

    Queue.prototype.add = function(fn) {
        this.work.push(fn);
    };

    Queue.prototype.go = function() {
        var def     = new Gitana.Defer();
        var chunks  = chunk(this.work, this.concurrency);
        var results = [];
        var promise = Gitana.Promise.resolved([]);
        (function loop(promise) {
            promise.then(function(res) {
                results.push.apply(results, res);
                if (chunks.length > 0) {
                    var cbs = chunks.shift();
                    var ps  = [];
                    for (var i = cbs.length - 1; i >= 0; i--) {
                        var cb = cbs[i];
                        var p  = cb();
                        ps.push(p);
                    };
                    loop(Gitana.Defer.all(ps));
                } else {
                    def.resolve(results);
                }
            }, def.reject);
        })(Gitana.Promise.resolved([]));
        return def.promise;
    }

    Gitana.Queue = Queue;

})(window);
