module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    var srcFilesBasic = [
        '<%= dirs.src %>QuestGame.js'
    ];

    var srcFiles = [];
    srcFiles = srcFiles.concat(srcFiles, srcFilesBasic);

    banner = [
        '/**',
        ' * <%= pkg.name %> - v<%= pkg.version %>',
        ' * Copyright (c) 2014, Eugene Batalov <eugene@learzing.com>',
        ' * <%= pkg.homepage %>',
        ' *',
        ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
        ' *',
        ' */',
        ''].join('\n');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        dirs: {
            bin: 'bin/',
            src: 'src/',
        },

        files : {
            bin : {
                debug : 'quest_script.dev.js',
                release : 'quest_script.js'
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: banner,
                separator: grunt.util.linefeed
            },
            debug : {
                src: srcFiles,
                dest: '<%= dirs.bin %><%= files.bin.debug %>'
            },
            release : {
                src: srcFiles,
                dest: '<%= dirs.bin %><%= files.bin.release %>'
            }
        },

        uglify: {
            options : {
            },
            debug : {
                options : {
                    preserveComments : true,
                    beautify : true,
                    compress : false,
                    mangle : false,
                },
                src : '<%= dirs.bin %><%= files.bin.debug %>',
                dest: '<%= dirs.bin %><%= files.bin.debug %>'
            },
            release : {
                options : {
                    preserveComments : false
                },
                src : '<%= dirs.bin %><%= files.bin.release %>',
                dest: '<%= dirs.bin %><%= files.bin.release %>'
            }
        }

    });

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['build-debug', 'build-release']);
    grunt.registerTask('build-debug', ['concat:debug', 'uglify:debug']);
    grunt.registerTask('build-release', ['concat:release', 'uglify:release']);
};