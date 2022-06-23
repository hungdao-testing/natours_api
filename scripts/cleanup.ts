import { rm } from 'shelljs'

function deleteFolder() {
  ;['./tests', './playwright.config.ts', './dist/playwright.*', './dist/tests'].forEach((el) =>
    rm('-rf', el),
  )
}

function main() {
  deleteFolder()
}

main()
