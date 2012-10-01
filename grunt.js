module.exports = function(grunt) {

	// https://github.com/cowboy/grunt/issues/236
	// grunt server wait
	
	grunt.registerTask('wait', 'Wait for a set amount of time.', function(delay) {
	  var d = delay ? delay + ' second' + (delay === '1' ? '' : 's') : 'forever';
	  grunt.log.write('Waiting ' + d + '...');
	  // Make this task asynchronous. Grunt will not continue processing
	  // subsequent tasks until done() is called.
	  var done = this.async();
	  // If a delay was specified, call done() after that many seconds.
	  if (delay) { setTimeout(done, delay * 1000); }
	});
	
	// TASK: web
    grunt.registerTask('web', 'server wait');	

    grunt.initConfig({
		qunit: ["http://localhost:8980/tests/index.html"],
        server: {
            port: 8980,
            base: '.'
        }
    });

	// TASK: test
    grunt.registerTask('test', 'server qunit');
};