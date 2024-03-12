import { toNano } from '@ton/core';
import { NftSale } from '../wrappers/NftSale';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftSale = provider.open(NftSale.createFromConfig({}, await compile('NftSale')));

    await nftSale.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftSale.address);

    // run methods on `nftSale`
}
