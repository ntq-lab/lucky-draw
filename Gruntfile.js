'use strict';

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		clean: {
			public: 'public',
		},
		copy: {
			dev: {
				files: [{
					expand: true,
					cwd: 'client',
					src: '*/**',
					dest: 'public',
					filter: 'isFile',
				}],
			},
		},
		injector: {
			dev: {
				options: {
					template: 'client/index.tpl.html',
				},
				files: {
					'public/index.html': require('./client/assets.json'),
				},
			},
		},
		watch: {
			options: {
				spawn: false,
			},
			client: {
				files: [
					'client/**',
					'packages.json',
				],
				tasks: ['clean:public', 'copy:dev', 'injector'],
			},
			server: {
				files: [
					'server/**',
				],
				tasks: ['develop:server'],
			},
		},
		develop: {
			server: {
				file: 'server/index.js',
			},
		},
	});

	grunt.registerTask('default', [
		'clean:public',
		'copy:dev',
		'injector:dev',
		'develop:server',
		'watch',
	]);
};
