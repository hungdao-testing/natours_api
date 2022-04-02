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
    workers: process.env.NODE_ENV === 'local' ? 3 : 4,
    reporter: [['allure-playwright']],
    globalSetup: require.resolve('./src/tests/hook/globalSetup.ts'),
    globalTeardown: require.resolve('./src/tests/hook/globalTeardown')
}
export default config
