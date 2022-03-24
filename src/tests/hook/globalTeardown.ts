import { FullConfig, request } from '@playwright/test'

async function globalApiTeardown(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const requestCtx = await request.newContext()
  await requestCtx.delete(`${baseURL}/test-data/delete-fixture`)
  console.log('Data is successfully deleted!!!')
}

export default globalApiTeardown
