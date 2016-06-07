module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	copy: {
		main: {
		    expand: true,
		    cwd: 'src',
		    src: '**',
			dest: 'build/',
		}
	},
	clean: ["build"]
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['clean','copy']);

};