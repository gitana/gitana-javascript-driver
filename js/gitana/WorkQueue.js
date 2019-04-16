(function(window)
{
    Gitana.WorkQueue = function(maxSize) {

        if (!maxSize) {
            maxSize = 3;
        }

        let blockExecution = false;

        const pendingWorkFns = [];
        let activeCount = 0;

        const processWork = function () {

            // if another "thread" is running the processor, don't bother
            if (blockExecution)
            {
                return;
            }

            blockExecution = true;

            // add as many pending work items as we can, loop until full or no more pending
            let process = true;
            do
            {
                // if nothing to work on, bail
                if (pendingWorkFns.length === 0)
                {
                    process = false;
                }

                // if we're full, bail
                if (activeCount >= maxSize)
                {
                    process = false;
                }

                if (process)
                {
                    // increment active count
                    activeCount++;

                    //console.log("Active work items: " + activeCount);

                    // define execution function and splice/bind to 0th element from pending list
                    const executionFn = function(workFn) {
                        return function() {
                            workFn(function () {

                                // decrement active count
                                activeCount--;

                                //console.log("Active work items: " + activeCount);

                                // process more work on timeout
                                window.setTimeout(processWork);
                            });

                        };
                    }(pendingWorkFns.splice(0, 1)[0]);

                    // execute on timeout
                    window.setTimeout(executionFn);
                }

            } while (process);

            blockExecution = false;
        };

        return function(workFn) {
            pendingWorkFns.push(workFn);

            // execute on timeout
            window.setTimeout(processWork);
        };

    };

})(window);
