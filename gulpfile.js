
var gulp = require("gulp");
var sass = require("gulp-sass");
var pug = require("gulp-pug");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var gcmq = require('gulp-group-css-media-queries');
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var server = require("browser-sync").create();

gulp.task("style", function(done) {
  gulp.src("source/static/sass/style.scss")
    .pipe(plumber())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gcmq())
    .pipe(gulp.dest("source/static/css"))
    .pipe(server.stream());

    done();
});

gulp.task("sprite", function() {
  return gulp.src("source/static/images/**/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/static/images"));
});

gulp.task("pug", () => {
  return gulp.src("source/pug/pages/*.pug")
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest("source"))
});

gulp.task("watch", function() {
  gulp.watch("source/static/sass/**/*.{scss,sass}", gulp.series("style"));
  gulp.watch("source/*.html").on("change", server.reload);
  gulp.watch("source/images/").on("change", server.reload);
  gulp.watch("source/pug/**/*.pug", gulp.series("pug"));
  gulp.watch("source/static/js/*.js").on("change", server.reload);
});

gulp.task("serve", gulp.series("style", function(done) {
  server.init({
    server: "source/",
    notify: false,
    port: "2222",
    open: false,
    cors: true,
    ui: false
  });

  done();
}));

gulp.task("default", gulp.series("serve", "watch"));
