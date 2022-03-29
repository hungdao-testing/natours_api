import { spawn } from 'child_process'
import { pathManagement } from '../../config/env.config';
import path from 'path'


//custom the path of allure_result_dir folder
process.env.ALLURE_RESULTS_DIR = path.join(pathManagement.allureReporter, "allure-results")

const allureResult = path.join(pathManagement.allureReporter, 'allure-results')

export function generateReport() {

    return spawn('allure', ['generate', allureResult, '--clean',], {
        cwd: __dirname,
        shell: true,
    })

}

generateReport()