require('esbuild')
  .build({
    entryPoints: ['./src/public/js/index.ts'],
    outfile: './dist/src/public/js/bundle/index.js',
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    platform: 'node',
    loader: { '.ts': 'ts' },
    logLevel: 'info',
    target: 'node14',
  })
  .then(() => console.log('⚡ Done'))
  .catch(() => process.exit(1))
