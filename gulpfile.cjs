const gulp = require("gulp");
const minifyCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const terser = require("gulp-terser");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();
const del = require("del");

gulp.task("minCss", async function () {
  return gulp
    .src("app/css/*.scss")
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("public/css"))
    .pipe(browserSync.stream());
});

gulp.task("minJs", async function () {
  return gulp
    .src("app/js/*.js", { sourcemaps: false })
    .pipe(
      plumber(function (err) {
        console.error("JS Error", err.message);
        this.emit("end");
      })
    )
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("public/js"))
    .pipe(browserSync.stream());
});

gulp.task("watchAll", function () {
  gulp.watch("app/css/*.scss", gulp.series("minCss"));
  gulp.watch("app/js/*.js", gulp.series("minJs"));
});

gulp.task("browserSync", function () {
  browserSync.init({
    server: "public/",
  });

  gulp.watch("public/*.html").on("change", browserSync.reload);
});

gulp.task("default", gulp.parallel("browserSync", "watchAll"));
