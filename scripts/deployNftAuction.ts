import { toNano } from '@ton/core';
import { NftAuction } from '../wrappers/NftAuction';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftAuction = provider.open(NftAuction.createFromConfig({}, await compile('NftAuction')));

    await nftAuction.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftAuction.address);

    // run methods on `nftAuction`
}
