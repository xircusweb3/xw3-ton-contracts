import { toNano } from '@ton/core';
import { SbtCollection } from '../wrappers/SbtCollection';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const compiled = await compile('SbtCollection')

    const sbtCollection = provider.open(SbtCollection.createFromConfig({}, compiled));

    console.log("COMPILED", compiled, sbtCollection)

    await sbtCollection.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(sbtCollection.address);

    // run methods on `sbtCollection`
}
