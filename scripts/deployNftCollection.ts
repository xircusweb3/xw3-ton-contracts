import { Address, beginCell, toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import { NftItem } from '../wrappers/NftItem'
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const compiled = await compile('NftCollection')

    const owner:any = provider.sender().address?.toString()
    const content = beginCell().storeStringTail('ipfs://SAMPLE_TON_COLLECTION_DATA').endCell()
    const nftItem = await compile('NftItem')
    const royalty = beginCell().endCell()

    const params = {
        owner: Address.parse(owner),
        content: content,
        nftItem: nftItem,
        royalty: royalty
    }

    console.log("CONFIG", params)
    const nftCollection = provider.open(NftCollection.createFromConfig(params, compiled));

    console.log("NFT COLLECTION", nftCollection)

    // await nftCollection.sendDeploy(provider.sender(), toNano('0.05'));

    // await provider.waitForDeploy(nftCollection.address);

    // run methods on `nftCollection`
}
