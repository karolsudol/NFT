import { ethers } from "hardhat";

async function main() {
  const baseTokenURI = "ipfs://QmZPHoUR1hy5RgrjqMp7pZXx3wFM56kB5qaMGYingfEeNS/";

  const NFT = await ethers.getContractFactory("NFTcollectible");
  const nft = await NFT.deploy(baseTokenURI);

  await nft.deployed();

  console.log("NFTCollectible deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
