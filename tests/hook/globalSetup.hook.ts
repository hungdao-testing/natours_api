import { FullConfig, request } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects.find((pj) => pj.name === 'rest_api')?.use!
  const context = await request.newContext({
    baseURL,
  })

  await context.delete(`/api/v1/test-data/delete-fixture`).catch((e) => {
    throw new Error(`Could not delete test-data-fixture \n ${e}`)
  })
  await context.post('/api/v1/test-data/create-fixture').catch((e) => {
    throw new Error(`Could not create test-data-fixture \n ${e}`)
  })
}

export default globalSetup
