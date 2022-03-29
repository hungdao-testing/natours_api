import { FullConfig, request } from '@playwright/test'
import { existsSync } from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import { pathManagement } from '../../../config/env.config';





function deleteAllureFolderIfExist() {
  const allureResult = path.join(
    pathManagement.allureReporter,
    'allure-results',
  )
  const allureReport = path.join(
    pathManagement.allureReporter,
    'allure-report',
  )

  if (existsSync(allureReport)) {
    rimraf(allureReport, function () {
      console.log('done deleting allure report')
    })
  }
  if (existsSync(allureResult)) {
    rimraf(allureResult, function () {
      console.log('done deleting allure result')
    })
  }
}

async function globalApiSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const requestCtx = await request.newContext({ baseURL })

  await requestCtx.delete(`/api/v1/test-data/delete-fixture`)
  await requestCtx.post(`/api/v1/test-data/create-fixture`)

  deleteAllureFolderIfExist()
  console.log('Finished setup process')
}

export default globalApiSetup
