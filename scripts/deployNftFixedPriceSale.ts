import { toNano } from '@ton/core';
import { NftFixedPriceSale } from '../wrappers/NftFixedPriceSale';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftFixedPriceSale = provider.open(NftFixedPriceSale.createFromConfig({}, await compile('NftFixedPriceSale')));

    await nftFixedPriceSale.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftFixedPriceSale.address);

    // run methods on `nftFixedPriceSale`
}
