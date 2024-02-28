import { toNano } from '@ton/core';
import { SimpleNftMarket } from '../wrappers/SimpleNftMarket';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const simpleNftMarket = provider.open(SimpleNftMarket.createFromConfig({}, await compile('SimpleNftMarket')));

    await simpleNftMarket.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(simpleNftMarket.address);

    // run methods on `simpleNftMarket`
}
