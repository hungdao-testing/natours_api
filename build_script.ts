import {cp} from 'shelljs'

const buildFolder = './dist/';

// const files = new Set(['.env', 'LICENSE', 'README.md', 'package.json', 'package-lock.json']);
const folders = new Set(['./data', './config', './src/public', './src/main/views']);

// Copy Files
// files.forEach((file) => {
//   shell.cp('-R', file, buildFolder);
// });

// Copy Folders
folders.forEach((folder) => {
  cp('-R', folder, buildFolder);
});