import { cp } from 'shelljs'


const folderMapping: {source: string, dest: string}[] = [
  {
    source: './data',
    dest: './dist/',
  },
  {
    source: './config',
    dest: './dist/',
  },
  {
    source: './src/public',
    dest: './dist/src/',
  },
  {
    source: './src/main/views',
    dest: './dist/src/main',
  },
]

folderMapping.forEach(folderMap => {
  cp('-R', folderMap.source, folderMap.dest)
})