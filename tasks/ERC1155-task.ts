import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

const NFT_CONTRACT: string = process.env.NFT_CONTRACT_ERC1155_GOERLI! as string;
console.log(NFT_CONTRACT);

task("mintNFT", "mint a NFT ERC1155")
  .addParam("recipient", "recipient address")
  .addParam("tokenuri", "ipfs metadata location")
  .setAction(async (taskArgs: { recipient: any; _tokenURI: any }, hre) => {
    const nft = await hre.ethers.getContractAt("KokoERC1155", NFT_CONTRACT);
    await nft.mintNFT(taskArgs.recipient, taskArgs._tokenURI);
    console.log("NFT ERC1155 minted");
  });
