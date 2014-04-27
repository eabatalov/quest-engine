module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    var srcFiles = [
        '<%= dirs.src %>se_event_router.js',
        '<%= dirs.src %>se_display_object.js',
        '<%= dirs.src %>se_node_view.js',
        '<%= dirs.src %>se_cond_view.js',
        '<%= dirs.src %>se_toolbar.js',
        '<%= dirs.src %>se_scene.js',
        '<%= dirs.src %>se_scene_size_tweak.js',
        '<%= dirs.src %>se_stage_editor.js',
        '<%= dirs.src %>se.js',
        '<%= dirs.src %>se_mousewheel.js',
        '<%= dirs.src %>se_compile_btn.js',
        '<%= dirs.src %>se_prop_window.js',
        '<%= dirs.src %>se_user_interaction_manager.js',
        '<%= dirs.src %>se_stages_panel.js',
        '<%= dirs.src %>se_save_load_btn.js',
        '<%= dirs.src %>se_project.js',
        '<%= dirs.src %>se_service.js',
        '<%= dirs.src %>se_ng_app.js'
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
                debug : 'script_editor.dev.js',
                release : 'script_editor.js'
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
    grunt.registerTask('build', ['build-deps', 'build-debug', 'build-release']);
    grunt.registerTask('build-debug', ['concat:debug', 'uglify:debug']);
    grunt.registerTask('build-release', ['concat:release', 'uglify:release']);

    grunt.registerTask('build-deps', buildDependencies.bind(null, grunt, 0, {}, srcFiles));
};

/*
 * Our custom bicycle to build all dependencies recursively
 */
function buildDependencies(grunt, recursiveLevel, allDepSet, srcFiles) {
    var execSync = require("exec-sync");
    var REPO_PATH = "../../../";
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
        srcFiles.push(depBinOutPath);
        grunt.log.ok(recursiveLevel, "Added ", depBinOutPath, " as js dependency file for processing");
        var depBuildCmd = 'grunt ' + dep.args;

        grunt.log.ok(recursiveLevel, "Building dependency ", depPackage.name, " exec: ", depBuildCmd);
        process.chdir(depPath);
        var gruntResult = execSync(depBuildCmd);
        grunt.log.writeln(gruntResult.toString());

        buildDependencies(grunt, recursiveLevel + 1, allDepSet, srcFiles);  
    }
    process.chdir(baseWD);
}
