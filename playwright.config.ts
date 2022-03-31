import { PlaywrightTestConfig } from '@playwright/test'


const config: PlaywrightTestConfig = {
    projects: [
        {
            name: 'api',
            use: {
                baseURL: `http://localhost:3001`,
            },
            testMatch: /.*.spec.ts/,
        },
    ],
    reporter: [['allure-playwright']],
    globalSetup: require.resolve('./src/tests/hook/globalSetup.ts'),
    globalTeardown: require.resolve('./src/tests/hook/globalTeardown')
}
export default config
