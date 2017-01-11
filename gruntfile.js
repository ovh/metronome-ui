module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.html',
          dest: 'build'
        }, {
          expand: true,
          cwd: 'src',
          src: '**/*.ico',
          dest: 'build'
        }, {
          expand: true,
          cwd: 'node_modules/bulma/css/',
          src: "*.css*",
          dest: "build/css/"
        }, {
          expand: true,
          cwd: 'node_modules/font-awesome/css/',
          src: "*min.css*",
          dest: "build/css/"
        }, {
          expand: true,
          cwd: 'node_modules/font-awesome/fonts/',
          src: "fontawesome-webfont.*",
          dest: "build/fonts"
        }, {
          expand: true,
          cwd: 'node_modules/jquery/dist/',
          src: "jquery.min.*",
          dest: "build/js/"
        }, {
          expand: true,
          cwd: 'node_modules/angular/',
          src: "angular.min.*",
          dest: "build/js/"
        }, {
          expand: true,
          cwd: 'node_modules/angular-route/',
          src: "angular-route.min.*",
          dest: "build/js/"
        }, {
          expand: true,
          cwd: 'node_modules/angular-animate/',
          src: "angular-animate.min.*",
          dest: "build/js/"
        }, {
          expand: true,
          cwd: 'node_modules/angularjs-toaster/',
          src: "toaster.min.js",
          dest: "build/js/"
        }, {
          expand: true,
          cwd: 'node_modules/angularjs-toaster/',
          src: "toaster.min.css",
          dest: "build/css/"
        }, {
          expand: true,
          cwd: 'node_modules/js-cookie/src/',
          src: "*.js",
          dest: "build/js/"
        }, {
          expand: true,
          cwd: 'node_modules/moment/min/',
          src: "*.js",
          dest: "build/js/"
        }, {
          expand: true,
          cwd: 'node_modules/angular-moment/',
          src: "*.min.js*",
          dest: "build/js/"
        }, {
          expand: true,
          cwd: 'node_modules/js-sha256/build',
          src: "*.min.js",
          dest: "build/js/"
        },{
        }, {
          expand: true,
          cwd: 'node_modules/angular-jwt/dist',
          src: "*.min.js",
          dest: "build/js/"
        },{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'build'
        }]
      },
    },
    uglify: {
      build: {
        options: {},
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'build'
        }]
      }
    },
    less: {
      build: {
        options: {},
        files: [{
          src: 'src/style/sign.less',
          dest: 'build/css/sign.css'
        }, {
          src: 'src/style/dash.less',
          dest: 'build/css/dash.css'
        }]
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')()
        ]
      },
      build: {
        files: [{
          src: 'build/css/sign.css'
        },
        {
          src: 'build/css/dash.css'
        }]
      }
    },
    processhtml: {
      options: {},
      dist: {
        files: [{
          expand: true,
          cwd: 'build',
          src: '**/*.html',
          dest: 'dist'
        }]
      }
    },
    clean: {
      build: ['build'],
      dist: ['dist'],
    },
    watch: {
      dev: {
        files: ['src/**/*'],
        tasks: ['build'],
        options: {
          atBegin: true,
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['clean:dist', 'dist']);
  grunt.registerTask('build', ['copy:build', 'less:build', 'postcss:build']);
  grunt.registerTask('dist', ['build', 'processhtml:dist']);
  grunt.registerTask('dev', ['watch:dev']);
};
