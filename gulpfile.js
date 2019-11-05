let gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    newer = require('gulp-newer'),
    browserSync = require('browser-sync');


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
    .pipe(browserSync.reload({
      stream: true
    }))
})

// Copy html files to dist
gulp.task('html', function(){
  return gulp.src('app/**/*.html')
    .pipe(newer('dist/')) // Only get the modified files
    .pipe(gulp.dest('dist/'))
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// Watch
// gulp.task('watch', ['browserSync', 'sass'], function (){
//   gulp.watch('scss/**/*.scss', ['sass']);
//   //
// })

// watch files for changes and reload
gulp.task('serve', function (done) {
  browserSync({
    server: {
      baseDir: './dist',
      index: "index.html"
    }
  });
  done();
});


// Default task
gulp.task('default', gulp.series('clean', 'sass', 'html', 'serve'))

// Deployment task
gulp.task('build', gulp.series('clean', 'sass', 'html'))
