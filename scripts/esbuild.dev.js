require('esbuild')
  .build({
    entryPoints: ['./src/public/js/index.ts'],
    outfile: './src/public/js/bundle/index.js',
    bundle: true,
    watch: true,
    platform: 'node',
    loader: { '.ts': 'ts' },
    logLevel: 'info',
    target: 'node14',
  })
  .then(() => console.info('⚡ Done'))
  .catch(() => process.exit(1))
