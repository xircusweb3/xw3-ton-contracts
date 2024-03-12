import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NftMarketWallet } from '../wrappers/NftMarketWallet';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NftMarketWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NftMarketWallet');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftMarketWallet: SandboxContract<NftMarketWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftMarketWallet = blockchain.openContract(NftMarketWallet.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await nftMarketWallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftMarketWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftMarketWallet are ready to use
    });
});
