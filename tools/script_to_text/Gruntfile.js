module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    var srcFiles = [
        '<%= dirs.src %>main.js'
    ];

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
                debug : 'main.dev.js',
                release : 'main.min.js'
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
    grunt.registerTask('build',
        ['build-deps', 'tweak-jquery-deps', 'build-debug', 'build-release']);
    grunt.registerTask('build-debug', ['concat:debug', 'uglify:debug']);
    grunt.registerTask('build-release', ['concat:release', 'uglify:release']);

    grunt.registerTask('build-deps', buildDependencies.bind(null, grunt, 0, {}, srcFiles));
    grunt.registerTask('tweak-jquery-deps', tweakJqueryDeps.bind(null, grunt, srcFiles));
};

//XXX
function tweakJqueryDeps(grunt, srcFiles) {
    var JQUERY_NPM_PATH = "./node_modules/jquery-core-nodom/";
    var mainJQScript = grunt.file.readJSON(JQUERY_NPM_PATH + 'package.json').main;
    srcFiles.unshift(JQUERY_NPM_PATH + mainJQScript);
};

/*
 * Our custom bicycle to build all dependencies recursively
 */
function buildDependencies(grunt, recursiveLevel, allDepSet, srcFiles) {
    var sh = require('execSync');
    var REPO_PATH = "../../";
    var gruntDependencies =
        grunt.file.readJSON('package.json').gruntDependencies;

    if (!gruntDependencies)
        return;

    var baseWD = process.cwd();
    grunt.log.ok(recursiveLevel, "Found dependencies in ", baseWD.toString());

    for (var i = 0; i < gruntDependencies.length; ++i) {
        var dep = gruntDependencies[i];
        if (allDepSet[dep.path])
            continue;

        allDepSet[dep.path] = dep;
        process.chdir(baseWD);
        var depPath = REPO_PATH + dep.path + "/";
        var depPackage = grunt.file.readJSON(depPath + "package.json");
        var depBinOutPath = depPath + depPackage.main;
        srcFiles.unshift(depBinOutPath);
        grunt.log.ok(recursiveLevel, "Added ", depBinOutPath, " as js dependency file for processing");
        var depBuildCmd = 'grunt ' + dep.args;

        grunt.log.ok(recursiveLevel, "Building dependency ", depPackage.name, " exec: ", depBuildCmd);
        process.chdir(depPath);
        var gruntResult = sh.exec(depBuildCmd);
        grunt.log.writeln(gruntResult.toString());

        buildDependencies(grunt, recursiveLevel + 1, allDepSet, srcFiles);  
    }
    process.chdir(baseWD);
}