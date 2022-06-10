import fs from 'fs';
import path from 'path';


export function getTestAsset(fileName: string) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', `assets/${fileName}`), { encoding: 'utf-8' }))
}