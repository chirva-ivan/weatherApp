var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	notify = require('gulp-notify');

gulp.task('connect', function() {
  connect.server({
  	root: "app",
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('app/weather.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['app/weather.html'], ['html']);
});

gulp.task('default', ['connect', 'watch']);