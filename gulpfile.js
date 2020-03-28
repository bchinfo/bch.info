let gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    newer = require('gulp-newer'),
    browserSync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    reload = browserSync.reload;


// TASKS
gulp.task('clean', function(done){
  // Deletes all files from dist/
  del.sync('dist/', {force: true});
  done()
});

gulp.task('sass', function(){
  return gulp.src('scss/style.scss')
    .pipe(sass()) // Compiles styles.scss to css
    .pipe(cleanCSS({compatibility: 'ie9'})) // Minifies CSS
    .pipe(gulp.dest('app/static/css'))
    .pipe(reload({
      stream: true
    }))
});

// Copy html files to dist
gulp.task('html', function(){
  return gulp.src('app/**/*.html')
    .pipe(newer('dist/')) // Only get the modified files
    .pipe(gulp.dest('dist/'))
});

// Copy all static files
gulp.task('copy-static', function(){
  return gulp.src('app/static/**/*.*', {base: './app/static/'})
    .pipe(gulp.dest('dist/static/'));
});

gulp.task('reload', function(done){
  reload();
  done();
});

// Watch for changes
gulp.task('watch', function(done){
  // Watch HTML pages
  gulp.watch('app/**/*.html', gulp.series('html', 'copy-static', 'reload'));
  // Watch SCSS files
  gulp.watch('scss/**/*.scss', gulp.series('sass', 'copy-static'));
  done();
});

// Starts browserSync
gulp.task('serve', function(done){
  browserSync({
    server: {
      baseDir: './dist',
      index: "index.html"
    }
  });
  done();
});


// Default task
gulp.task('default', gulp.series('clean', 'sass', 'html',
  'copy-static', 'serve', 'watch'));

// Deployment task
gulp.task('build', gulp.series('clean', 'sass', 'html', 'copy-static'));
