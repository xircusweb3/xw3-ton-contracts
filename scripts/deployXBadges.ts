import { toNano } from '@ton/core';
import { XBadges } from '../wrappers/XBadges';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const xBadges = provider.open(
        XBadges.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('XBadges')
        )
    );

    await xBadges.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(xBadges.address);

    console.log('ID', await xBadges.getID());
}
