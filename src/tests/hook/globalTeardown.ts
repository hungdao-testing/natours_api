import { FullConfig, request } from '@playwright/test'
import { generateReport } from '../../../reporters/allure/allure.config'

async function globalApiTeardown(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const requestCtx = await request.newContext({ baseURL })
  await requestCtx.delete(`/api/v1/test-data/delete-fixture`)

  generateReport().on('close', () =>
    console.log('Finishing generating report!!!'),
  )
}
export default globalApiTeardown
