var gulp = require('gulp'),
  connect = require('gulp-connect');
gulp.task('connect', function() {
  connect.server({
    root: 'app/dist/',
    port: 8000,
    livereload: true
  });
});
 
gulp.task('html', function () {
  gulp.src('./app/dist/index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/dist/index.html'], ['html']);
});
 
gulp.task('default', ['connect','watch']);
