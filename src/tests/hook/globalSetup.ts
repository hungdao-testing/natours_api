import { expect, FullConfig, request } from '@playwright/test'

async function globalApiSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const requestCtx = await request.newContext()

  await requestCtx.delete(`${baseURL}/test-data/delete-fixture`)
  console.log('Data is successfully deleted!!!')

  await requestCtx.post(`${baseURL}/test-data/create-fixture`)
  console.log('Data is successfully loaded!!!')
}

export default globalApiSetup
