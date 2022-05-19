import {cp} from 'shelljs'

const buildFolder = './dist/';

const featureFolders = new Set(['./data', './config', './src/public', './src/main']);

// Copy Folders
featureFolders.forEach((folder) => {
  cp('-R', folder, buildFolder);
});

const viewsFolder = './src/main/views/'
cp('-R', viewsFolder, './dist/src/main')