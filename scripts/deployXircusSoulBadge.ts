import { toNano } from '@ton/core';
import { XircusSoulBadge } from '../wrappers/XircusSoulBadge';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const xircusSoulBadge = provider.open(XircusSoulBadge.createFromConfig({}, await compile('XircusSoulBadge')));

    await xircusSoulBadge.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(xircusSoulBadge.address);

    // run methods on `xircusSoulBadge`
}
