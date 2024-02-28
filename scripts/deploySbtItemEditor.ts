import { toNano } from '@ton/core';
import { SbtItemEditor } from '../wrappers/SbtItemEditor';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sbtItemEditor = provider.open(SbtItemEditor.createFromConfig({}, await compile('SbtItemEditor')));

    await sbtItemEditor.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(sbtItemEditor.address);

    // run methods on `sbtItemEditor`
}
