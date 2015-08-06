var gulp = require('gulp'),
    ngAnnotate = require("gulp-ng-annotate");
autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    minifyCSS = require("gulp-minify-css"),
    sass = require('gulp-sass');

gulp.task("uglify", function () {
    gulp.src("js/main.js")
        .pipe(ngAnnotate())
        .pipe(uglify({outSourceMap: true}))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('js'));
});

gulp.task('styles', function () {
    livereload.listen();
    return gulp.src('styles/*.scss')
        .pipe(sass({
            onError: function (err) {
                console.log(err);
            }
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'safari 5', 'ios 6', 'android 4']
        }))
        .pipe(minifyCSS())
        .pipe(livereload())
        .pipe(gulp.dest('styles/'))
});
gulp.task("watch", function () {
    livereload.listen();
    gulp.watch('styles/**', ['styles']);
    //gulp.watch('js/**', ['uglify']);
});
