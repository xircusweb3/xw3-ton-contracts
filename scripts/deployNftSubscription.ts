import { toNano } from '@ton/core';
import { NftSubscription } from '../wrappers/NftSubscription';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftSubscription = provider.open(NftSubscription.createFromConfig({}, await compile('NftSubscription')));

    await nftSubscription.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftSubscription.address);

    // run methods on `nftSubscription`
}
