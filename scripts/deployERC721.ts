import { ethers } from "hardhat";

async function main() {
  const NFT = await ethers.getContractFactory("KokoERC721");
  const nft = await NFT.deploy();

  await nft.deployed();

  console.log("KokoERC721 deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
