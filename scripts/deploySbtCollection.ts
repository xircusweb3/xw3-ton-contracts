import { Address, toNano } from '@ton/core';
import { SbtCollection } from '../wrappers/SbtCollection';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const compiled = await compile('SbtCollection')

    const item = await compile('SbtItem')

    const owner:any = provider?.sender().address?.toString()

    const sbtCollection = provider.open(SbtCollection.createFromConfig({
        owner: Address.parse(owner),
        sbtItem: item,
        content: 'ipfs://SBT_COLLECTION',
        versionType: 'SBT:1'
    }, compiled));

    console.log("COMPILED", compiled, sbtCollection)

    await sbtCollection.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(sbtCollection.address);

    // run methods on `sbtCollection`
}
