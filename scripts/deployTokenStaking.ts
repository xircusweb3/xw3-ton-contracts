import { toNano } from '@ton/core';
import { TokenStaking } from '../wrappers/TokenStaking';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tokenStaking = provider.open(TokenStaking.createFromConfig({}, await compile('TokenStaking')));

    await tokenStaking.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(tokenStaking.address);

    // run methods on `tokenStaking`
}
