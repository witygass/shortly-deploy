module.exports = function(grunt) {

  grunt.initConfig({
    // encapsulates the gruntfile configuration
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      options: { seperator: ';'},
      dist: {
        src: ['./public/client/*.js'],
        dest: './dist/concat.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
    },

    eslint: {
      target: [
        './**/*.js',
        '!./lib/**/*',
        '!./node_modules/**/*',
        '!./public/lib/**/*'
      ]
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
    gitcommit: {
      yourTarget: {
        options: {
          cwd: 'ssh://root@138.197.201.236/root/shortly-beta/site.git'
        },
        files: [
          {
            src: ['./'],
            expand: true,
            cwd: 'ssh://root@138.197.201.236/root/shortly-beta/site.git'
          }
        ]
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [ 'eslint', 'mochaTest',  
  ]);

  grunt.registerTask('start', ['nodemon']);

  // grunt.registerTask( '' , ['concat']);

  grunt.registerTask('commitProd', ['gitcommit']);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['']);  // NEED TO FINISH THIS
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
  ]);


};
