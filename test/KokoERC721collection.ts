import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { formatEther, parseEther } from "ethers/lib/utils";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("KokoERC721collection", function () {
  async function deployNFT() {
    const baseTokenURI =
      "ipfs://QmZPHoUR1hy5RgrjqMp7pZXx3wFM56kB5qaMGYingfEeNS/";
    const [owner, acc1, acc2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("KokoERC721collection");
    const nft = await NFT.deploy(baseTokenURI);

    return { owner, acc1, acc2, nft };
  }

  describe("mint", function () {
    it("Should revert a mint aNFT collection correctly if insufficient balance", async function () {
      const { nft } = await loadFixture(deployNFT);
      await expect(
        nft.mintNFTs(2, {
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("insufficient balance");
    });
    it("Should revert a mint aNFT collection correctly if insufficient supply", async function () {
      const { nft } = await loadFixture(deployNFT);
      await nft.mintNFTs(2, {
        value: ethers.utils.parseEther("0.02"),
      });
      await nft.mintNFTs(2, {
        value: ethers.utils.parseEther("0.02"),
      });
      await nft.mintNFTs(2, {
        value: ethers.utils.parseEther("0.02"),
      });
      await nft.mintNFTs(2, {
        value: ethers.utils.parseEther("0.02"),
      });
      await nft.mintNFTs(2, {
        value: ethers.utils.parseEther("0.02"),
      });
      await expect(
        nft.mintNFTs(2, {
          value: ethers.utils.parseEther("0.02"),
        })
      ).to.be.revertedWith("insufficient supply");
    });
    it("Should revert a mint aNFT collection correctly if items restricted count", async function () {
      const { nft } = await loadFixture(deployNFT);
      await expect(
        nft.mintNFTs(3, {
          value: ethers.utils.parseEther("0.03"),
        })
      ).to.be.revertedWith("mint number only 1 or 2");
    });
    it("Should mint aNFT collection correctly if sufficient balance", async function () {
      const { nft, owner } = await loadFixture(deployNFT);
      await nft.mintNFTs(2, {
        value: ethers.utils.parseEther("0.02"),
      });
      expect(await nft.balanceOf(owner.address)).to.equal(2);
    });
    it("Should records collection items count correctly", async function () {
      const { nft, owner } = await loadFixture(deployNFT);
      await nft.mintNFTs(2, {
        value: ethers.utils.parseEther("0.02"),
      });
      expect((await nft.ownedTokens(owner.address)).length).to.equal(2);
    });
  });

  describe("withdrawal", function () {
    it("Should withdraw a NFT correctly", async function () {
      const { nft, owner, acc1 } = await loadFixture(deployNFT);
      await nft.mintNFTs(2, {
        value: ethers.utils.parseEther("0.02"),
      });
      expect(await nft.balanceOf(owner.address)).to.equal(2);

      let provider = ethers.provider;
      const ethBalanceOriginal = await provider.getBalance(owner.address);
      // console.log("original eth balanace %f", ethBalanceOriginal);
      await nft
        .connect(acc1)
        .mintNFTs(1, { value: ethers.utils.parseEther("0.01") });

      const ethBalanceBeforeWithdrawal = await provider.getBalance(
        owner.address
      );
      // console.log(
      //   "eth balanace before withdrawal %f",
      //   ethBalanceBeforeWithdrawal
      // );
      await nft.connect(owner).withdraw();

      const ethBalanceAfterWithdrawal = await provider.getBalance(
        owner.address
      );
      // console.log(
      //   "eth balanace after withdrawal %f",
      //   ethBalanceAfterWithdrawal
      // );
      expect(ethBalanceOriginal.eq(ethBalanceBeforeWithdrawal)).to.equal(true);
      expect(ethBalanceAfterWithdrawal.gt(ethBalanceBeforeWithdrawal)).to.equal(
        true
      );
    });
    it("Should revert a withdrawl correctly if insufficient balance", async function () {
      const { nft, owner } = await loadFixture(deployNFT);
      await expect(nft.connect(owner).withdraw()).to.be.revertedWith(
        "insufficient balance"
      );
    });
    it("Should revert a withdrawl correctly if not owner", async function () {
      const { nft, acc1 } = await loadFixture(deployNFT);
      await expect(nft.connect(acc1).withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
