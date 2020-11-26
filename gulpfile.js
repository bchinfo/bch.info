const gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    browserSync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    i18n = require('gulp-html-i18n'),
    concat = require('gulp-concat'),
    terser = require('gulp-terser'),
    reload = browserSync.reload;


// TASKS

gulp.task('clean', function(done){
  // Deletes all files from dist/ and dist-lang/
  del.sync('dist/', {force: true});
  del.sync('dist-lang/', {force: true});
  done()
});


// Internationalization

gulp.task('i18n', function(){
  return gulp.src('dist-lang/**/*.html')
    .pipe(i18n({
      langDir: 'lang', // takes translations from /lang/
      createLangDirs: true,
      defaultLang: 'en',
      fallback: 'en',
      delimiters: ['$(',')$']  // to avoid conflicts with Nunjucks
    }))
    .pipe(gulp.dest('dist'));
});


// Nunjucks

gulp.task('nunjucks', function() {
  // Gets all .html files in pages
  return gulp.src('app/**/*.html')
  // Adds data from exchanges.json
  .pipe(data(function() {
    return require('./app/data/exchanges.json')
  }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
    path: ['app/templates/']
  }))
  // Outputs files in dist folder
  .pipe(gulp.dest('dist-lang'))
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


// Concat JavaScript

gulp.task('js', function() {
  const files = [
    'node_modules/jquery/dist/jquery.slim.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/moveto/dist/moveTo.min.js',
    'js/*.js'
  ];
  return gulp.src(files)
    .pipe(concat('scripts.js'))
    // Minify JS
    .pipe(terser())
    .pipe(gulp.dest('dist/static/js/'));
});


// Copy all static files

gulp.task('copy-static', function(done){
  // Copy special files to dist/
  gulp.src('app/special/*').pipe(gulp.dest('dist/'));
  // Copy static files
  gulp.src('app/static/**/*.*', {base: './app/static/'})
    .pipe(gulp.dest('dist/static/'));
  // Copy independant JavaScript files
  gulp.src('node_modules/bchaddrjs/dist/bchaddrjs-0.4.9.min.js')
    .pipe(gulp.dest('dist/static/js/'));
  gulp.src('node_modules/qrcode/build/qrcode.min.js')
    .pipe(gulp.dest('dist/static/js/'));
  gulp.src('node_modules/qrcode/build/qrcode.min.js.map')
    .pipe(gulp.dest('dist/static/js/'));
  done();
});


gulp.task('reload', function(done){
  reload();
  done();
});


// Watch for changes

gulp.task('watch', function(done){
  // Watch HTML pages
  gulp.watch('app/**/*', gulp.series('nunjucks', 'i18n',
    'copy-static', 'reload'));
  // Watch SCSS files
  gulp.watch('scss/**/*.scss', gulp.series('sass', 'copy-static'));
  // Watch static files
  gulp.watch('app/static/**/*.*', gulp.series('copy-static',
    'reload'));
  // Watch JS files
  gulp.watch('js/*.js', gulp.series('js', 'reload'));
  // Watch translations
  gulp.watch('lang/**/*.yaml', gulp.series('i18n', 'reload'));
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

gulp.task('default', gulp.series('clean', 'sass', 'nunjucks', 'i18n',
  'copy-static', 'js', 'serve', 'watch'));


// Deployment task

gulp.task('build', gulp.series('clean', 'sass', 'nunjucks', 'i18n',
  'copy-static', 'js'));
