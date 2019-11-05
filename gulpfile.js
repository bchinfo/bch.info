let gulp = require('gulp'),
    sass = require('gulp-sass');


// Tasks
gulp.task('sass', function(){
  return gulp.src('scss/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/static/css'))
})
