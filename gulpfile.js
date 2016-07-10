var gulp = require('gulp'),
	//livereload = require('gulp-livereload'),
	connect = require('gulp-connect');
	//notify = require('gulp-notify');

gulp.task('connect', function () {
  connect.server({
  	root: "app/",
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(['./app/*.html'])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('default', ['connect', 'html', 'watch']);