module.exports = function (grunt) {
    grunt.initConfig({

        uglify: {
            options: {
//                mangle: false
            },
            my_target: {
                files: [
                    {
                        expand: true,
                        cwd: 'frontend/vendor',
                        src: '**/*.js',
                        dest: 'frontend/vendor',
                        ext: '.min.js'
                    }
                ]
            }
        },

        bower: {
            install: {
                options: {
                    targetDir: './frontend/vendor',
                    layout: 'byComponent',
                    cleanup: false,
                    install: true,
                    verbose: true,
                    copy: true
                }
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/',
                        src: ['*/**.min.js', '*/**.js'],
                        dest: 'frontend/vendor'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery-ui/ui/',
                        src: ['minified/*.min.js'],
                        dest: 'frontend/vendor/jquery-ui'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist/',
                        src: ['**'],
                        dest: 'frontend/vendor/bootstrap/dist'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/socket.io-client/',
                        src: ['**'],
                        dest: 'frontend/vendor/socket.io-client'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['bower', 'copy']);
};