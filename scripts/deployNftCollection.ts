import { Address, Cell, beginCell, toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import { NftItem } from '../wrappers/NftItem'
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const compiled = await compile('NftCollection')

    const owner:any = provider.sender().address?.toString()
    const content = beginCell().storeRef(beginCell().storeStringTail('ipfs://SAMPLE_TON_COLLECTION_DATA').endCell()).endCell()
    const nftItem = await compile('NftItem')
    const royalty = Cell.EMPTY

    const params = {
        owner: Address.parse(owner),
        content: content,
        nftItem: nftItem,
        royalty: royalty
    }

    console.log("CONFIG", params)
    const nftCollection = provider.open(NftCollection.createFromConfig(params, compiled));

    console.log("NFT COLLECTION", nftCollection)

    await nftCollection.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftCollection.address);
}
