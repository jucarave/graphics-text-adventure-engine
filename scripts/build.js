const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');
const isMinify = process.argv.includes('--minify');

async function build() {
  try {
    const context = await esbuild.context({
      entryPoints: ['src/Game.ts'],
      bundle: true,
      outfile: 'dist/js/game.js',
      sourcemap: true,
      minify: isMinify,
      plugins: [
        {
          name: 'rebuild',
          setup(build) {
            build.onEnd(result => {
              if (result.errors.length > 0) {
                console.error('Build failed:', result.errors);
              } else {
                console.log('Build succeeded');
              }
            });
          }
        }
      ]
    });

    if (isWatch) {
      console.log('Watching for changes...');
      await context.watch();
    } else {
      await context.rebuild();
      console.log('Build succeeded');
      await context.dispose();
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();