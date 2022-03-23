import { PlaywrightTestConfig } from '@playwright/test'

const port = process.env.PORT


const config: PlaywrightTestConfig = {
    projects: [
        {
            name: 'api',
            use: {

                baseURL: `http://localhost:3001/api/v1`,
            },
            testMatch: /.*.spec.ts/,

        },
    ],

    globalSetup: require.resolve('./src/tests/hook/globalSetup.ts'),
    globalTeardown: require.resolve('./src/tests/hook/globalTeardown')
}
export default config
