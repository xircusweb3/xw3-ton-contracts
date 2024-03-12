import { toNano } from '@ton/core';
import { NftMarketWallet } from '../wrappers/NftMarketWallet';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const nftMarketWallet = provider.open(NftMarketWallet.createFromConfig({}, await compile('NftMarketWallet')));

    await nftMarketWallet.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nftMarketWallet.address);

    // run methods on `nftMarketWallet`
}
