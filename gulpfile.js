const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const jsFiles = ['*.js', 'src/**/*.js'];
const views = ['src/**/*.pug'];

var files = jsFiles.concat(views);

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js']);
    var injectOptions = {
        ignorePath: '/public'
    };

    var options = {
        bowerJson: require('./bower.json'),
        directory: './bower_components',
        ignorePath: '../../bower_components'
        // we do the above becase we set up the static folder in app.js
    };

    return gulp.src('./src/views/*.pug')
        .pipe(wiredep(options))
        // .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views'));
});

gulp.task('run', ['inject'], function() {
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
