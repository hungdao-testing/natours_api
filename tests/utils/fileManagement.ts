import { ITour } from '@app_type'
import fs from 'fs'
import path from 'path'

function getTestAsset(fileName: string) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', `assets/${fileName}`), { encoding: 'utf-8' }),
  )
}

export function getTourPayloadAsset(): ITour {
  return getTestAsset('tourPayload.json')
}
