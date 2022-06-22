import { cp, rm } from 'shelljs'


const folderMapping: { source: string, dest: string }[] = [
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
  }
]

function deleteFolder() {
  ['./tests', './playwright.config.ts', './dist/playwright.*', './dist/tests'].forEach(el => rm('-rf', el))
}

function main() {
  folderMapping.forEach(folderMap => {
    cp('-R', folderMap.source, folderMap.dest)
  })

  deleteFolder()
}

main()