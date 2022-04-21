import { PlaywrightTestConfig } from '@playwright/test'
import dotenv from 'dotenv'

import { appConfig } from './config/env.config'

if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: appConfig.dev_env })
} else if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: appConfig.local_env })
} else if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: appConfig.prod_env })
}

const port = process.env.PORT;

const config: PlaywrightTestConfig = {
    projects: [
        {
            name: 'api',
            use: {
                baseURL: `http://localhost:${port}`,
            },
            testMatch: /.*.spec.ts/,
            testDir: "./src/tests/"
        },
    ],

    reporter: [['allure-playwright']],
    globalSetup: require.resolve('./src/tests/hook/globalSetup.ts'),
    globalTeardown: require.resolve('./src/tests/hook/globalTeardown')
}
export default config
