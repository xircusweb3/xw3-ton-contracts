import { config, xircus } from './blueprint.config'
const { isBlueprint, hasBlueprint } = require('./utils/detect')
const { ipfsUpload } = require('./utils/ipfs')
const { Select } = require('enquirer')
const { readFileSync } = require('fs')
const { snakecase } = require('snakecase')
import { compile } from '@ton/blueprint'
const qr = require('qrcode-terminal')

const extractFC = async(file: any) => {
  const currentPath = process.cwd()
  const slug = snakecase(file)
  const content = await readFileSync(currentPath + `/contracts/${slug}.fc`, 'utf-8')

  let params:any = {}
  let getters:any = []

  const inits:any = content.match(/\b(save_data|store_data)\s*\(([^)]*)\)/)
  const methods = content.match(/^(.*\s+method_id)/gm)

  if (methods) {
    getters = methods.map((line: any) => {
      const matches = line.match(/^((\(.+?\)|(\w+)))\s+(\w+)\((.+?)?\)/)
      // console.log("LINE", line, matches)
      return {
        name: matches[4],
        returnType: extractReturns(matches[2]),
        params: extractParams(matches[5] || '')
      }
    })
  }

  if (inits) {
    params = extractParams(inits[2])
  }

  return {
    params,
    getters,
    contractName: slug
  }
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
  const bpVersion = hasBlueprint(currentPath)

  if (!bp) {
    process.exit(0)
  }


  console.log("BLUEPRINT PROJECT", bp)

  const names = Object.keys(xircus)

  const prompt = new Select({
    message: 'Select To Publish',
    choices: names
  })

  const selected = await prompt.run()
  const files = Object.values(xircus)[Object.keys(xircus).indexOf(selected)]
  // const baseContract = Cell.fromBase64(base64Contract) -- base64 to cell

  let contracts: any = {}

  // TODO: ABI

  for (let file of files) {
    try {
      const contract = await compile(file)
      const base64Contract = contract.toBoc().toString('base64')
      const { contractName, getters, params } = await extractFC(file)
      contracts[file] = {
        getters,
        contract: contractName,
        constructor: params,
        code: base64Contract
      }
    } catch (e) {
      console.log("ERRRO", e)
    }
  }

  const ctrNames = Object.keys(contracts)

  const contractCode = {
    name: selected,
    desc: '',
    mainContract: contracts[ctrNames[0]]?.contract, // parent contract
    itemContract: ctrNames.length > 1 ? contracts[ctrNames[1]]?.contract : false, // next contract is child
    names: ctrNames,
    // itemContract: contracts[1].contract,
    contracts,
    version: 1,
    blueprint: bpVersion,
    compiledBy: 'Xircus'
  }
  
  console.log(`\n\nPublishing Contracts...`)
  const reply = await ipfsUpload(JSON.stringify(contractCode)) 

  if (reply.Hash) {
    console.log(`\n\n`)
    console.log(`   Open the link below to view on TON Studio:\n`)
    console.log(`   ${`https://ton.xircus.app/contracts/deploy/${reply.Hash}`}`)
    console.log(`   ${`https://cloudflare-ipfs.com/ipfs/${reply.Hash}`}\n\n`)    

    qr.generate(`https://cloudflare-ipfs.com/ipfs/${reply.Hash}`, { small: true })

  }

}

main()

// console.log("METHOD MATCH", getters)
// params = match[2].split(',').map((d:any) => {
//   let data = d.trim().split(' ')
//   return { type: data[0], name: data[1] }
// })
