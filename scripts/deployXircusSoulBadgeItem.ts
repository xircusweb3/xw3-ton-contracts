import { toNano } from '@ton/core';
import { XircusSoulBadgeItem } from '../wrappers/XircusSoulBadgeItem';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const xircusSoulBadgeItem = provider.open(XircusSoulBadgeItem.createFromConfig({}, await compile('XircusSoulBadgeItem')));

    await xircusSoulBadgeItem.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(xircusSoulBadgeItem.address);

    // run methods on `xircusSoulBadgeItem`
}
