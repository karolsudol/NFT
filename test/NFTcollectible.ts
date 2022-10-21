import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { formatEther, parseEther } from "ethers/lib/utils";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("NFTcollectible", function () {
  async function deployNFT() {
    const baseTokenURI =
      "ipfs://QmZPHoUR1hy5RgrjqMp7pZXx3wFM56kB5qaMGYingfEeNS/";
    const [owner, acc1, acc2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFTcollectible");
    const nft = await NFT.deploy(baseTokenURI);

    return { owner, acc1, acc2, nft };
  }

  describe("mint NFT", function () {
    it("Should reserve a NFT correctly", async function () {
      const { nft, owner } = await loadFixture(deployNFT);
      await nft.reserveNFTs();
      expect(await nft.balanceOf(owner.address)).to.equal(10);
    });
    it("Should charge correctly for mint NFT", async function () {
      const { nft, owner } = await loadFixture(deployNFT);
      await nft.mintNFTs(3, {
        value: ethers.utils.parseEther("0.03"),
      });
      expect(await nft.balanceOf(owner.address)).to.equal(3);
    });
  });

  describe("withdrawal NFT", function () {
    it("Should withdraw a NFT correctly", async function () {
      const { nft, owner, acc1 } = await loadFixture(deployNFT);
      await nft.reserveNFTs();
      expect(await nft.balanceOf(owner.address)).to.equal(10);

      let provider = ethers.provider;
      const ethBalanceOriginal = await provider.getBalance(owner.address);
      console.log("original eth balanace %f", ethBalanceOriginal);
      await nft
        .connect(acc1)
        .mintNFTs(1, { value: ethers.utils.parseEther("0.01") });

      const ethBalanceBeforeWithdrawal = await provider.getBalance(
        owner.address
      );
      console.log(
        "eth balanace before withdrawal %f",
        ethBalanceBeforeWithdrawal
      );
      await nft.connect(owner).withdraw();

      const ethBalanceAfterWithdrawal = await provider.getBalance(
        owner.address
      );
      console.log(
        "eth balanace after withdrawal %f",
        ethBalanceAfterWithdrawal
      );
      expect(ethBalanceOriginal.eq(ethBalanceBeforeWithdrawal)).to.equal(true);
      expect(ethBalanceAfterWithdrawal.gt(ethBalanceBeforeWithdrawal)).to.equal(
        true
      );
    });
  });
});

// describe("NFTcollectible", function () {
//   async function deployNFT() {
//     const baseTokenURI = "ipfs://QmZPHoUR1hy5RgrjqMp7pZXx3wFM56kB5qaMGYingfEeNS/";
//     const [owner, acc1, acc2] = await ethers.getSigners();
//     const NFT = await ethers.getContractFactory("NFTCollectible");
//     const nft = await NFT.deploy(baseTokenURI);

//     return { owner, acc1, acc2, nft };
//   }

//     describe("Deployment", function () {
//     it("Should reserve NFT", async function () {
//       const { nft , owner} = await loadFixture(deployNFT);
//       nft.reserveNFTs();

//       expect(await nft.balanceOf(owner.address)).to.equal(10);
//     });

// });

// }
