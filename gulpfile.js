const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
	gulp.src('src/*.js')
		.pipe(babel({presets: ['es2015']}))
		.pipe(gulp.dest('dist'))
);

var watcher = gulp.watch('src/*.js', ['default']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});