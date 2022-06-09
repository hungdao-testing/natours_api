import { cp } from 'shelljs'


const folderMapping: { source: string, dest: string }[] = [
  {
    source: './data',
    dest: './dist/',
  },
  {
    source: './config',
    dest: './dist/',
  },
  {
    source: './src/public/css',
    dest: './dist/src/public/css',
  },
  {
    source: './src/public/img',
    dest: './dist/src/public',
  },
  {
    source: './src/public/overview.html',
    dest: './dist/src/public',
  },
  {
    source: './src/public/tour.html',
    dest: './dist/src/public',
  },
  {
    source: './src/views',
    dest: './dist/src',
  },
  // handle TS path alias after compiling to js
  //https://github.com/dividab/tsconfig-paths/issues/61
  {
    source: './tsconfig.json',
    dest: './dist',
  },
]

folderMapping.forEach(folderMap => {
  cp('-R', folderMap.source, folderMap.dest)
})