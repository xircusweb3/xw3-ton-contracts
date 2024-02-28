const IPFS_INFURA_URL = 'https://ipfs.infura.io:5001'
const PROJECT_ID = '25DTb1GmpjcxCp6rQbT8NtluggA'
const PROJECT_SECRET = '195b62cb1f3d374b87f98ff35ffec2a2'

const ipfsUrl = () => {
  return `https://${domain}.infura-ipfs.io/ipfs/${hash}`
}

const ipfsUpload = async(data) => {
  const FormData = (await import('form-data')).default
  const fetch = (await import('isomorphic-fetch')).default
  const formData = new FormData()
  formData.append('file', data)
  const options = {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${btoa(PROJECT_ID + ':' + PROJECT_SECRET)}`
    }
  }
  const reply = await fetch(`${IPFS_INFURA_URL}/api/v0/add?pin=true`, options)
  return await reply.json()  
}

module.exports = { ipfsUpload, ipfsUrl }