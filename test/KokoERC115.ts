import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { formatEther, parseEther } from "ethers/lib/utils";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("KokoERC1155", function () {
  async function deployNFT() {
    const tokenURI =
      "ipfs://QmZPHoUR1hy5RgrjqMp7pZXx3wFM56kB5qaMGYingfEeNS/koko.png";
    const [owner, acc1, acc2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("KokoERC1155");
    const nft = await NFT.deploy();

    return { owner, acc1, acc2, nft, tokenURI };
  }

  describe("mintNFT", function () {
    it("Should revert a awardItem correctly if not owner", async function () {
      const { nft, acc1, tokenURI } = await loadFixture(deployNFT);
      await expect(
        nft.connect(acc1).mintNFT(acc1.address, tokenURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should mintNFT correctly and set counter to 1", async function () {
      const { nft, owner, tokenURI, acc1 } = await loadFixture(deployNFT);

      await expect(nft.connect(owner).mintNFT(acc1.address, tokenURI))
        .to.emit(nft, "NFTMinted")
        .withArgs(1);

      expect(await nft._tokenIds()).to.equal(1);
    });
  });
});
