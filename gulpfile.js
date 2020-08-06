const gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    newer = require('gulp-newer'),
    browserSync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    nunjucksRender = require('gulp-nunjucks-render'),
    concat = require('gulp-concat');
    reload = browserSync.reload;


// TASKS
gulp.task('clean', function(done){
  // Deletes all files from dist/
  del.sync('dist/', {force: true});
  done()
});

// Nunjucks
gulp.task('nunjucks', function() {
  // Gets all .html files in pages
  return gulp.src('app/**/*.html')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
    path: ['app/templates/']
  }))
  // Outputs files in dist folder
  .pipe(gulp.dest('dist'))
});

// Compile Sass
gulp.task('sass', function(){
  return gulp.src('scss/style.scss')
    .pipe(sass()) // Compiles styles.scss to css
    .pipe(cleanCSS({compatibility: 'ie9'})) // Minifies CSS
    .pipe(gulp.dest('app/static/css'))
    .pipe(reload({
      stream: true
    }))
});

// Contat JavaScript
gulp.task('js', function() {
  return gulp.src('js/*.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('dist/static/js/'));
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
  gulp.watch(['app/**/*.html', 'app/**/*.njk'], gulp.series('nunjucks',
    'copy-static', 'reload'));
  // Watch SCSS files
  gulp.watch('scss/**/*.scss', gulp.series('sass', 'copy-static'));
  // Watch static files
  gulp.watch('app/static/**/*.*', gulp.series('copy-static',
    'reload'));
  // Watch JS files
  gulp.watch('js/*.js', gulp.series('js', 'reload'));
  done();
});

// Starts browserSync
gulp.task('serve', function(done){
  browserSync({
    server: {
      baseDir: './dist',
      index: "index.html",
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });
  done();
});


// Default task
gulp.task('default', gulp.series('clean', 'sass', 'nunjucks',
  'copy-static', 'js', 'serve', 'watch'));

// Deployment task
gulp.task('build', gulp.series('clean', 'sass', 'nunjucks',
  'copy-static', 'js'));
