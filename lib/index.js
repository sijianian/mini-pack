import * as fs from 'fs'
import path from 'path'
import babylon from 'babylon'
import { default as travese } from 'babel-travese'
import { transformFromAst } from 'babel-core'

/**
 * Gets the file and parses it into ast syntax
 * @param fileName
 * @returns {*}
 */
function getAst (fileName) {
  const content = fs.readFileSync(fileName, 'utf-8')

  return babylon.parse(content, {
    sourceType: 'module',
  })
}

function getDependence (ast) {
  let dependencies = []

  travese(ast, {
    ImportDeclaration: ({ node, }) => {
      dependencies.push(node.source.value)
    },
  })

  return dependencies
}

/**
 * compile
 * @param ast
 * @returns {*}
 */
function getTranslateCode (ast) {
  const { code, } = transformFromAst(ast, null, {
    presets: ['env'],
  })

  return code
}

/**
 * Generate a complete file dependency mapping
 * @param fileName
 * @param entry
 * @returns {{ fileName: *, dependence, code: * }}
 */
function parse (fileName, entry) {
  let filePath = fileName.indexOf('.js') === -1 ? `${fileName}.js` : fileName
  let dirName = entry ? '' : path.dirname(config.entry)
  let absolutePath = path.join(dirName, filePath)

  const ast = getAst(absolutePath)

  return {
    fileName,
    dependence: getDependence(ast),
    code: getTranslateCode(ast),
  }
}

/**
 * Gets the deep queue dependency
 * @param main
 * @returns {*{}}
 */
function getQueue (main) {
  let queue = [main]

  for (let asset of queue) {
    asset.dependence.forEach(function (dep) {
      let child = parse(dep)

      queue.push(child)
    })
  }

  return queue
}

function bundle (queue) {
  let modules = ''

  queue.forEach(function (mod) {
    modules += `'${mod.fileName}': function (require, module, exports) { ${
      mod.code
    } }`
  })
}