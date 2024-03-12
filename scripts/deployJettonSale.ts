import { toNano } from '@ton/core';
import { JettonSale } from '../wrappers/JettonSale';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const jettonSale = provider.open(JettonSale.createFromConfig({}, await compile('JettonSale')));

    await jettonSale.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jettonSale.address);

    // run methods on `jettonSale`
}
