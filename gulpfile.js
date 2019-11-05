let gulp = require('gulp'),
    sass = require('gulp-sass')
    del = require('del')
    newer = require('gulp-newer');


// TASKS
gulp.task('clean', function(done){
  // Deletes all files from dist/
  del.sync('dist/', {force: true});
  done()
})

gulp.task('sass', function(){
  return gulp.src('scss/style.scss')
    .pipe(sass()) // Compiles styles.scss to css
    .pipe(gulp.dest('app/static/css'))
})

// Copy html files to dist
gulp.task('html', function(){
  return gulp.src('app/**/*.html')
    .pipe(newer('dist/')) // Only get the modified files
    .pipe(gulp.dest('dist/'))
})


// Default task
gulp.task('default', gulp.series('clean', 'sass', 'html'))
