module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    var srcFilesBasic = [
        '<%= dirs.src %>consts.js',
        '<%= dirs.src %>node.js',
        '<%= dirs.src %>cond.js',
        '<%= dirs.src %>stage.js',
        '<%= dirs.src %>script.js',
        '<%= dirs.src %>serialization.js'
    ];

    var srcFilesPlugins = [
        '<%= dirs.src %>plugins/plugins.js',
        '<%= dirs.src %>plugins/cond_type_validator.js',
        '<%= dirs.src %>plugins/notification_center.js',
        '<%= dirs.src %>plugins/quest_objects_manager.js',
        '<%= dirs.src %>plugins/stage_search.js',
        '<%= dirs.src %>plugins/storyline_search.js',
        '<%= dirs.src %>plugins/validation_broker.js',
        '<%= dirs.src %>plugins/next_cond_search.js'
    ];

    var srcFilesInterpretator = [
        '<%= dirs.src %>interpretator/quest_event.js',
        '<%= dirs.src %>interpretator/storyline.js',
        '<%= dirs.src %>interpretator/stage.js',
        '<%= dirs.src %>interpretator/script.js'
    ];

    var srcFiles = srcFilesBasic;
    if (grunt.option("interpretator")) {
        grunt.log.writeln("ADDING INTERPRETATOR SRC");
        srcFiles = srcFiles.concat(srcFiles, srcFilesInterpretator);
    }
    if (grunt.option("plugins")) {
        grunt.log.writeln("ADDING PLUGINS SRC");
        srcFiles = srcFiles.concat(srcFiles, srcFilesPlugins);
    }

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
