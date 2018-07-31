module.exports = function (grunt) {
  "use strict";
  grunt.initConfig({
    ts: {
      default: {
        tsconfig: "tsconfig.json"
      }
    },
    copy: {
      files: {
        cwd: 'src/Resources/Views',
        src: '**/*',
        dest: 'build/Resources/Views',
        expand: true
      }
    },
    watch: {
      ts: {
        files: ["./src/**/*.ts"],
        tasks: ["ts"]
      },
      copy: {
        files: ["./src/Resources/Views/*.ejs"],
        tasks: ["copy"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("default", [
    "ts", "copy"
  ]);
};
