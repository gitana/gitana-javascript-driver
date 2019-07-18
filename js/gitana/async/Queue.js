(function(window) {

    Gitana = window.Gitana;

    const DEFAULT_CONCURRENCY = 1;

    const chunk = function(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    };

    const Queue = function(concurrency) {
        this.concurrency = concurrency || DEFAULT_CONCURRENCY;
        this.work = [];
    };

    Queue.prototype.add = function(fn) {
        this.work.push(fn);
    };

    Queue.prototype.go = function() {
        const def     = new Gitana.Defer();
        const chunks  = chunk(this.work, this.concurrency);
        const results = [];
        (function loop(promise) {
            promise.then(function(res) {
                results.push.apply(results, res);
                if (chunks.length > 0) {
                    const cbs = chunks.shift();
                    const ps  = [];
                    for (let i = cbs.length - 1; i >= 0; i--) {
                        const cb = cbs[i];
                        const p  = cb();
                        ps.push(p);
                    }
                    loop(Gitana.Defer.all(ps));
                } else {
                    def.resolve(results);
                }
            }, def.reject);
        })(Gitana.Promise.resolved([]));
        return def.promise;
    };

    Gitana.Queue = Queue;

})(window);
