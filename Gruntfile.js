module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            js: {
                files: ["js/app/js/**", "js/app/*.js"],
                tasks: ["concat:app"],
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
                src: [
                    'js/libs/jquery-2.1.1.js',
                    'js/vendors/angular.js',
                    'js/vendors/angular-animate.js',
                    //'js/vendors/angular-aria.js',
                    //'js/vendors/angular-cookies.js',
                    //'js/vendors/angular-loader.js',
                    //'js/vendors/angular-messages.js',
                    //'js/vendors/angular-mocks.js',
                    //'js/vendors/angular-resource.js',
                    'js/vendors/angular-route.js',
                    //'js/vendors/angular-sanitize.js',
                    //'js/vendors/angular-scenario.js',
                    'js/vendors/angular-touch.js',
                    'js/vendors/angular-translate.js',
                    'js/vendors/angular-translate-loader-static-files.js',
                    'js/vendors/modules/i18n/*.js',
                ],
                dest: 'public/js/vendors.js'
            },
            app: {
                src: [
                    'js/app/app.js',
                    'js/app/**/*.js'
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
        }
    });


    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");

     /* Build */
    grunt.registerTask("dev-build", ["less:development","concat","uglify"]);
    grunt.registerTask("dev-watch", ["watch"]);
    grunt.registerTask("dev", [ "dev-build", "dev-watch"]);
    grunt.registerTask("heroku:production", [ "dev-build"]);
};