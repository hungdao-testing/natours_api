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
    source: './src/main/views',
    dest: './dist/src/main',
  },
]

folderMapping.forEach(folderMap => {
  cp('-R', folderMap.source, folderMap.dest)
})