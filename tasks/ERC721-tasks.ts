import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const NFT_CONTRACT: string = process.env.NFT_CONTRACT_ERC721_GOERLI! as string;
console.log(NFT_CONTRACT);

task("awardItem", "mint a NFT ERC721")
  .addParam("tokeHolder", "receivers address")
  .addParam("tokenURI", "ipfs metadata location")
  .setAction(
    async (taskArgs: { tokeHolder: any; tokenURI: any }, hre) => {
      const nft = await hre.ethers.getContractAt("KokoERC721", NFT_CONTRACT);
      await nft.awardItem(taskArgs.tokeHolder, taskArgs.tokenURI);
      console.log("NFT ERC721 minted");
    }
  );
