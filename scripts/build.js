const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');
const isMinifiy = process.argv.includes('--minify');

async function build() {
  const context = await esbuild.context({
    entryPoints: ['src/Game.ts'],
    bundle: true,
    outfile: 'dist/js/game.js',
    sourcemap: true,
    minify: isMinifiy,
  });

  if (isWatch) {
    console.log('Watching for changes...');
    await context.watch();
  } else {
    await context.rebuild();
    await context.dispose();
  }
}

build().catch(() => process.exit(1));