const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')
const bundleFile = require('../lib/index')

const projectPath = process.cwd()
const configPath = path.join(projectPath, 'minipack.config.js')

function init() {
  let spinner = ora('正在打包配置文件...')

  spinner.start()

  if (!fs.existsSync(configPath)) {
    spinner.stop()

    chalk.red('找不到 “minipack.config.js” 配置文件.')
  }

  let config = require(configPath)

  const result = bundleFile(config)

  try {
    fs.writeFileSync(path.join(projectPath, config.output), result)
  } catch (e) {
    fs.mkdirSync(path.dirname(config.output))
    fs.writeFileSync(path.join(projectPath, config.output), result)
  }

  spinner.stop()
  chalk.yellow('已生成对应文件.')
}

init()
