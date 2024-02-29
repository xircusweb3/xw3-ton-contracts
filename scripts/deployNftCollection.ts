import { Address, Cell, beginCell, toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import { NftItem } from '../wrappers/NftItem'
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const compiled = await compile('NftCollection')
    const owner:any = provider.sender().address?.toString()
    const item = await compile('NftItem')
    const royalty = Cell.EMPTY

    const params = {
        owner: Address.parse(owner),
        content: 'ipfs://SAMPLE_TON_COLLECTION_DATA',
        item: item,
        royalty: royalty
    }

    const nftCollection = provider.open(NftCollection.createFromConfig(params, compiled));
    await nftCollection.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(nftCollection.address);

    await nftCollection.sendMint(provider.sender(), {
        queryId: 0,
        nftAmount: toNano('0.05'),
        nftId: 0,
        owner: Address.parse('0QDrsKwEJkJkAOb__bVxXluy5dLJcOs5UW8-uxnuioadI5fT'),
        contentUrl: 'ipfs://NFT_ONE_USER_ADDRESS',
        gas: toNano('0.1')
    })

    await provider.waitForDeploy(nftCollection.address)

}
