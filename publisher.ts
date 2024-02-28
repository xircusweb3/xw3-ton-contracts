import { config, xircus } from './blueprint.config'
const { isBlueprint } = require('./utils/detect')
const { ipfsUpload } = require('./utils/ipfs')
const { Prompt, Select } = require('enquirer')
const { readFileSync } = require('fs')
const { snakecase } = require('snakecase')
import { compile } from '@ton/blueprint'
import { Cell } from '@ton/core'


const extractFC = async(file: any) => {
  const currentPath = process.cwd()
  const slug = snakecase(file)
  const fc = await readFileSync(currentPath + `/contracts/${slug}.fc`, 'utf-8')  
}

const extractParams = (str:string) => {
  const splits = str.trim().split(',')
  if (splits.length > 1) {
    return splits.map((d:any) => {
      let data = d.trim().split(' ')
      return { type: data[0], name: data[1] }
    })  
  }
  return false
}

const extractReturns = (str:string) => str.replace(/[()]/g, '').split(',').map((i:string) => i.trim())

const main = async() => {
  const currentPath = process.cwd()
  const bp = isBlueprint(currentPath)
  console.log("BLUEPRINT PROJECT", bp)


  const names = Object.keys(xircus)

  const prompt = new Select({
    message: 'Select To Publish',
    choices: names
  })

  const selected = await prompt.run()
  const files = Object.values(xircus)[Object.keys(xircus).indexOf(selected)]
  // const baseContract = Cell.fromBase64(base64Contract) -- base64 to cell

  let contracts: any = {

  }

  // TODO: ABI

  for (let file of files) {
    try {
      const contract = await compile(file)
      const base64Contract = contract.toBoc().toString('base64')
      const slug = snakecase(file)
      const fc = await readFileSync(currentPath + `/contracts/${slug}.fc`, 'utf-8')

      let params:any = []
      let methods = []

      const match:any = fc.match(/\b(save_data|store_data)\s*\(([^)]*)\)/)
      const methodMatch = fc.match(/^(.*\s+method_id)/gm)
      const getters = methodMatch.map((line: any) => {
        const matches = line.match(/^((\(.+?\)|(\w+)))\s+(\w+)\((.+?)?\)/)
        // console.log("LINE", line, matches)
        return {
          name: matches[4],
          returnType: extractReturns(matches[2]),
          params: extractParams(matches[5] || '')
        }
      })

      if (match) {
        params = extractParams(match[2])
        // console.log("PARAMS", params)
      }

      contracts[file] = {
        contract: slug,
        getters,
        constructor: params,
        code: base64Contract
      }
    } catch (e) {
      console.log("ERRRO", e)
    }
  }

  const contractCode = {
    contracts,
    version: 1,
    compiledBy: 'Xircus',
    compiledAt: Date.now()
  }

  console.log("PUBLISHING", contractCode)
  const reply = await ipfsUpload(JSON.stringify(contractCode)) 
  console.log("REPLY", reply)
}

main()

// console.log("METHOD MATCH", getters)
// params = match[2].split(',').map((d:any) => {
//   let data = d.trim().split(' ')
//   return { type: data[0], name: data[1] }
// })
