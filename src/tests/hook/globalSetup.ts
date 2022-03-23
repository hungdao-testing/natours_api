import { expect, FullConfig, request } from '@playwright/test'

async function globalApiSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use
  const requestCtx = await request.newContext({ baseURL })
  await requestCtx.post(`${baseURL}/test-data/create-fixture`)
}

export default globalApiSetup
