import { toNano } from '@ton/core';
import { Subscription } from '../wrappers/Subscription';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const subscription = provider.open(Subscription.createFromConfig({}, await compile('Subscription')));

    await subscription.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(subscription.address);

    // run methods on `subscription`
}
