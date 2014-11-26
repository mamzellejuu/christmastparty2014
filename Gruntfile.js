module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            js: {
                files: [
                	"js/app/**/*.js",
                	"js/app/views/*.html",
                	"js/app/views/partials/*.html",
                	"js/app/*.js",
                	"js/main.js",
                	"js/libs/grid.js",
                	"js/libs/dispatcher.js"
                ],
                tasks: ["concat:vendors", "concat:app", "copy:app"],
                options: {
                    nospawn: true
                }
            },
            less: {
                files: ["less/*.less", "less/**/*.less"],
                tasks: ["less:development"],
                options: {
                    nospawn: true
                }
            }
        },
        less: {
            development: {
                files: {
                    "public/css/style.css": ["less/main.less"]
                }
            }
        },
        concat: {
            vendors: {
                src: [ //libs - vendors JS
                    'js/libs/jquery-2.1.1.js',
                    'js/libs/isotope.pkgd.min.js',
                    'js/libs/grid.js',
                    'js/libs/dispatcher.js',
                    'js/libs/file.upload.manager.js',
                    'js/vendors/angular.js',
                    'js/vendors/modules/angular-animate.js',
                    'js/vendors/modules/angular-route.js',
                    'js/vendors/modules/angular-touch.js',
                    'js/vendors/modules/angular-sanitize.js',
                    'js/vendors/modules/angular-translate.js',
                    'js/vendors/modules/angular-translate-loader-static-files.js',
                    'js/vendors/modules/i18n/*.js',
                    'js/vendors/modules/angularUtils.directives.dirPagination.js'
                ],
                dest: 'public/js/vendors.js'
            },
            app: {
                src: [
                    'js/main.js',
                    'js/app/providers/*.js',
                    'js/app/app.js',
                    'js/app/services/*.js',
                    'js/app/factories/*.js',
                    'js/app/filters/*.js',
                    'js/app/models/*.js',
                    'js/app/directives/*.js',
                    'js/app/controllers/*.js',
                    'js/app/modules/*.js'
                ],
                dest: 'public/js/app.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'public/js/vendors.min.js': ['public/js/vendors.js']
                }
            }
        },
        copy:{
            app:{
                expand: true,
                cwd:'js/',
                src: ['app/views/*',
                      'app/views/**/*',
                      'app/languages/*'],
                dest: 'public/'
            },
            i18n: {
                expand: true,
                flatten:true,
                src: ['js/vendors/modules/i18n/*'],
                dest: 'public/app/i18n/'
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

     /* Build */
    grunt.registerTask("dev-build", ["less:development","concat","copy:app","uglify"]);
    grunt.registerTask("dev-watch", ["watch"]);
    grunt.registerTask("dev", [ "dev-build", "dev-watch"]);
    grunt.registerTask("heroku:production", [ "dev-build"]);
};