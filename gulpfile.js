const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('run', function() {
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
