import { expect } from "chai";
import { ethers } from "hardhat";
import { MockSharpToken, SharpTokenIntegrator } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("SharpTokenIntegrator", function () {
  let sharpToken: MockSharpToken;
  let integrator: SharpTokenIntegrator;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let mockRegistry: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2, mockRegistry] = await ethers.getSigners();

    const MockSharpToken = await ethers.getContractFactory("MockSharpToken");
    sharpToken = await MockSharpToken.deploy(owner.address);
    await sharpToken.waitForDeployment();

    const SharpTokenIntegrator = await ethers.getContractFactory("SharpTokenIntegrator");
    integrator = await SharpTokenIntegrator.deploy(
      await sharpToken.getAddress(),
      mockRegistry.address,
      owner.address
    );
    await integrator.waitForDeployment();

    // Transfer token ownership to integrator so it can mint/burn
    await sharpToken.transferOwnership(await integrator.getAddress());
  });

  describe("Earn Tokens", function () {
    it("should allow skill registry to earn tokens", async function () {
      await expect(integrator.connect(mockRegistry).earnTokens(user1.address, ethers.parseEther("10"), "test"))
        .to.emit(integrator, "TokensEarned")
        .withArgs(user1.address, ethers.parseEther("10"), "test");

      expect(await sharpToken.balanceOf(user1.address)).to.equal(ethers.parseEther("10"));
    });

    it("should allow owner to earn tokens", async function () {
      await integrator.earnTokens(user1.address, ethers.parseEther("5"), "owner_grant");
      expect(await sharpToken.balanceOf(user1.address)).to.equal(ethers.parseEther("5"));
    });

    it("should revert when unauthorized address tries to earn", async function () {
      await expect(
        integrator.connect(user1).earnTokens(user1.address, ethers.parseEther("10"), "hack")
      ).to.be.revertedWith("Not authorized to earn");
    });

    it("should revert on zero amount", async function () {
      await expect(
        integrator.connect(mockRegistry).earnTokens(user1.address, 0, "zero")
      ).to.be.revertedWith("Amount must be > 0");
    });
  });

  describe("Spend Tokens", function () {
    beforeEach(async function () {
      // Give user1 some tokens
      await integrator.connect(mockRegistry).earnTokens(user1.address, ethers.parseEther("100"), "initial");
      // User1 approves integrator
      await sharpToken.connect(user1).approve(await integrator.getAddress(), ethers.parseEther("50"));
    });

    it("should spend tokens with allowance", async function () {
      await expect(integrator.spendTokens(user1.address, ethers.parseEther("10"), "verification"))
        .to.emit(integrator, "TokensSpent")
        .withArgs(user1.address, ethers.parseEther("10"), "verification");

      expect(await sharpToken.balanceOf(user1.address)).to.equal(ethers.parseEther("90"));
    });

    it("should revert on insufficient allowance", async function () {
      await expect(
        integrator.spendTokens(user1.address, ethers.parseEther("60"), "overspend")
      ).to.be.revertedWith("Insufficient allowance");
    });

    it("should revert on zero amount", async function () {
      await expect(
        integrator.spendTokens(user1.address, 0, "zero")
      ).to.be.revertedWith("Amount must be > 0");
    });
  });

  describe("Buy Tokens", function () {
    it("should buy tokens with MATIC", async function () {
      const maticAmount = ethers.parseEther("1");
      const expectedTokens = ethers.parseEther("100"); // 1 MATIC * 100 tokens/MATIC

      await expect(integrator.connect(user1).buyTokens({ value: maticAmount }))
        .to.emit(integrator, "TokensBought")
        .withArgs(user1.address, maticAmount, expectedTokens);

      expect(await sharpToken.balanceOf(user1.address)).to.equal(expectedTokens);
    });

    it("should revert on zero MATIC", async function () {
      await expect(
        integrator.connect(user1).buyTokens({ value: 0 })
      ).to.be.revertedWith("Must send MATIC");
    });
  });

  describe("Admin Functions", function () {
    it("should update rewards", async function () {
      await integrator.setRewards(
        ethers.parseEther("20"),
        ethers.parseEther("10"),
        ethers.parseEther("2")
      );

      expect(await integrator.issuerReward()).to.equal(ethers.parseEther("20"));
      expect(await integrator.recipientReward()).to.equal(ethers.parseEther("10"));
      expect(await integrator.verificationFee()).to.equal(ethers.parseEther("2"));
    });

    it("should update tokens per MATIC", async function () {
      await integrator.setTokensPerMatic(ethers.parseEther("200"));
      expect(await integrator.tokensPerMatic()).to.equal(ethers.parseEther("200"));
    });

    it("should allow owner to withdraw MATIC", async function () {
      // Send some MATIC to integrator
      await owner.sendTransaction({ to: await integrator.getAddress(), value: ethers.parseEther("1") });

      const before = await ethers.provider.getBalance(owner.address);
      await integrator.withdraw();
      const after = await ethers.provider.getBalance(owner.address);
      expect(after).to.be.gt(before);
    });

    it("should revert when non-owner calls admin functions", async function () {
      await expect(integrator.connect(user1).setRewards(1, 1, 1)).to.be.reverted;
      await expect(integrator.connect(user1).setTokensPerMatic(1)).to.be.reverted;
      await expect(integrator.connect(user1).withdraw()).to.be.reverted;
    });
  });
});
