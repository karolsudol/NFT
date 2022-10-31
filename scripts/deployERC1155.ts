import { ethers } from "hardhat";

async function main() {
  // const baseTokenURI = "ipfs://QmZPHoUR1hy5RgrjqMp7pZXx3wFM56kB5qaMGYingfEeNS/";

  const NFT = await ethers.getContractFactory("KokoERC1155");
  const nft = await NFT.deploy();

  await nft.deployed();

  console.log("ERC1155 deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
