import { Config } from '@ton/blueprint';

export const config: Config = {

}

export const xircus = {
  SimpleNFT: ['NftCollection', 'NftItem'],
  SBTCollection: ['SbtCollection', 'SbtItem'],
  NFTEditable: ['NftCollectionEditable', 'NftItemEditable'],
  NFTMarketplaceDirect: ['NftMarketplace', 'NftSale'],
  NFTMarketplaceAuction: ['NftMarketplace', 'NftAuction'],  
  Jetton: ['JettonMinter', 'JettonWallet'],
  JettonSale: ['JettonSale', 'JettonWallet']  
}