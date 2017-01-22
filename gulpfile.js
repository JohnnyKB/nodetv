const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const debug = require('gulp-debug');

const jsFiles = ['*.js', 'src/**/*.js'];
const views = ['src/**/*.pug'];

var files = jsFiles.concat(views);

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./dist/css/style.css', './dist/js/test.js'], {read: false});
    var injectOptions = {
        ignorePath: '/dist'
    };

    var wOptions = {
        bowerJson: require('./bower.json'),
        directory: './bower_components',
        ignorePath: '../../bower_components'
        // we do the ignore above becase we set up the static folder in app.js
    };

    return gulp.src('./src/views/*.pug')
        .pipe(wiredep(wOptions))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views'));
});

gulp.task('sass', function(){
  return gulp.src('./src/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('watch', function(){
  gulp.watch('./src/sass/*.scss', ['sass']);
})

gulp.task('run', ['inject', 'sass', 'watch'], function() {
  var options = {
    script: 'app.js',
    delayTime: 1,
    watch: jsFiles
  }
  return nodemon(options)
        .on('restart', function(ev){
          console.log(`#### Restarting server! ####`);
        })
})
