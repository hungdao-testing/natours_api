import { PlaywrightTestConfig, devices } from '@playwright/test';
import { environment } from '@config/env.config';



const config: PlaywrightTestConfig = {
    use: {
        baseURL: `localhost:${environment.PORT}`
    },
    globalSetup: require.resolve('./tests/hook/globalSetup.hook.ts'),
    testDir: 'tests',
    testIgnore: '**/test-assets',
    testMatch: '.*(spec)\.ts',
    workers: process.env.CI ? 2 : undefined,
    projects: [
        {
            name: "rest_api",
            testDir: 'specs/api',

        },
        {
            name: 'ui-chromium',
            use: { ...devices['Desktop Chrome'] },
            testDir: 'specs/ui',
        },
        {
            name: 'ui-firefox',
            use: { ...devices['Desktop Firefox'] },
            testDir: 'specs/ui',
        },
    ]
}

export default config;