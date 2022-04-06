import { spawn } from 'child_process'
import { appPath } from '../../config/env.config';
import path from 'path'


//custom the path of allure_result_dir folder
process.env.ALLURE_RESULTS_DIR = path.join(appPath.allureReporter, "allure-results")

const allureResult = path.join(appPath.allureReporter, 'allure-results')

export function generateReport() {

    return spawn('allure', ['generate', allureResult, '--clean',], {
        cwd: __dirname,
        shell: true,
    })

}

generateReport()