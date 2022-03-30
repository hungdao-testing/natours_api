import path from 'path'

const configFolder = path.resolve(`${__dirname}`)

export const appConfig: { local_env: string; dev_env: string } = {
    local_env: path.join(configFolder, 'local.env'),
    dev_env: path.join(configFolder, 'dev.env'),
}

export const appPath = {
    allureReporter: path.join(configFolder, "../reporters/allure")
}

