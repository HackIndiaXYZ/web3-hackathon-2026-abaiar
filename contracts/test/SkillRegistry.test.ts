import { expect } from "chai";
import { ethers } from "hardhat";
import { SkillRegistry, MockSharpToken, SharpTokenIntegrator } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("SkillRegistry", function () {
  let skillRegistry: SkillRegistry;
  let sharpToken: MockSharpToken;
  let integrator: SharpTokenIntegrator;
  let owner: HardhatEthersSigner;
  let issuer1: HardhatEthersSigner;
  let issuer2: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, issuer1, issuer2, user1, user2] = await ethers.getSigners();

    const MockSharpToken = await ethers.getContractFactory("MockSharpToken");
    sharpToken = await MockSharpToken.deploy(owner.address);
    await sharpToken.waitForDeployment();

    const SkillRegistry = await ethers.getContractFactory("SkillRegistry");
    skillRegistry = await SkillRegistry.deploy(owner.address);
    await skillRegistry.waitForDeployment();

    const SharpTokenIntegrator = await ethers.getContractFactory("SharpTokenIntegrator");
    integrator = await SharpTokenIntegrator.deploy(
      await sharpToken.getAddress(),
      await skillRegistry.getAddress(),
      owner.address
    );
    await integrator.waitForDeployment();

    // Wire: transfer token ownership to integrator
    await sharpToken.transferOwnership(await integrator.getAddress());
    // Wire: set integrator on registry
    await skillRegistry.setTokenIntegrator(await integrator.getAddress());
  });

  // ============ Issuer Registration ============

  describe("Issuer Registration", function () {
    it("should register a new issuer", async function () {
      await expect(skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata"))
        .to.emit(skillRegistry, "IssuerRegistered")
        .withArgs(issuer1.address, "ipfs://issuer1-metadata");

      expect(await skillRegistry.isIssuer(issuer1.address)).to.be.true;
      expect(await skillRegistry.issuerMetadataCID(issuer1.address)).to.equal("ipfs://issuer1-metadata");
    });

    it("should revert on duplicate registration", async function () {
      await skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata");
      await expect(
        skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata-v2")
      ).to.be.revertedWith("Already registered");
    });

    it("should revert on empty metadata CID", async function () {
      await expect(
        skillRegistry.connect(issuer1).registerIssuer("")
      ).to.be.revertedWith("Metadata CID required");
    });

    it("should allow owner to deregister an issuer", async function () {
      await skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata");
      await expect(skillRegistry.connect(owner).deregisterIssuer(issuer1.address))
        .to.emit(skillRegistry, "IssuerDeregistered")
        .withArgs(issuer1.address);

      expect(await skillRegistry.isIssuer(issuer1.address)).to.be.false;
    });

    it("should revert when non-owner tries to deregister", async function () {
      await skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata");
      await expect(
        skillRegistry.connect(issuer2).deregisterIssuer(issuer1.address)
      ).to.be.reverted;
    });
  });

  // ============ Template Management ============

  describe("Template Management", function () {
    beforeEach(async function () {
      await skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata");
    });

    it("should create a template", async function () {
      const tx = await skillRegistry.connect(issuer1).createTemplate(
        "Web3 Developer",
        "Certified Web3 Developer",
        "ipfs://template-metadata"
      );
      await expect(tx)
        .to.emit(skillRegistry, "TemplateCreated")
        .withArgs(0, issuer1.address, "Web3 Developer");

      const tmpl = await skillRegistry.getTemplate(0);
      expect(tmpl.name).to.equal("Web3 Developer");
      expect(tmpl.issuer).to.equal(issuer1.address);
      expect(tmpl.active).to.be.true;
    });

    it("should revert when non-issuer creates template", async function () {
      await expect(
        skillRegistry.connect(user1).createTemplate("Test", "Desc", "ipfs://meta")
      ).to.be.revertedWith("Not a registered issuer");
    });

    it("should revert on empty name", async function () {
      await expect(
        skillRegistry.connect(issuer1).createTemplate("", "Desc", "ipfs://meta")
      ).to.be.revertedWith("Name required");
    });

    it("should deactivate a template", async function () {
      await skillRegistry.connect(issuer1).createTemplate("Test", "Desc", "ipfs://meta");
      await expect(skillRegistry.connect(issuer1).deactivateTemplate(0))
        .to.emit(skillRegistry, "TemplateDeactivated")
        .withArgs(0);

      const tmpl = await skillRegistry.getTemplate(0);
      expect(tmpl.active).to.be.false;
    });
  });

  // ============ Credential Issuance ============

  describe("Credential Issuance", function () {
    beforeEach(async function () {
      await skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata");
      await skillRegistry.connect(issuer1).createTemplate(
        "Web3 Developer",
        "Certified Web3 Developer",
        "ipfs://template-metadata"
      );
    });

    it("should issue a credential SBT", async function () {
      const tx = await skillRegistry.connect(issuer1).issueCredential(
        user1.address,
        0, // templateId
        0, // no expiry
        "ipfs://credential-metadata"
      );
      await expect(tx)
        .to.emit(skillRegistry, "CredentialIssued")
        .withArgs(0, user1.address, 0);

      expect(await skillRegistry.ownerOf(0)).to.equal(user1.address);
      expect(await skillRegistry.locked(0)).to.be.true;
    });

    it("should store credential data correctly", async function () {
      await skillRegistry.connect(issuer1).issueCredential(
        user1.address, 0, 0, "ipfs://credential-metadata"
      );

      const cred = await skillRegistry.getCredential(0);
      expect(cred.templateId).to.equal(0);
      expect(cred.recipient).to.equal(user1.address);
      expect(cred.issuer).to.equal(issuer1.address);
      expect(cred.revoked).to.be.false;
      expect(cred.expiresAt).to.equal(0);
    });

    it("should revert when non-issuer tries to issue", async function () {
      await expect(
        skillRegistry.connect(user1).issueCredential(user2.address, 0, 0, "ipfs://meta")
      ).to.be.revertedWith("Not a registered issuer");
    });

    it("should revert when wrong issuer tries to issue on template", async function () {
      await skillRegistry.connect(issuer2).registerIssuer("ipfs://issuer2-metadata");
      await expect(
        skillRegistry.connect(issuer2).issueCredential(user1.address, 0, 0, "ipfs://meta")
      ).to.be.revertedWith("Not template issuer");
    });

    it("should revert on expired expiry date", async function () {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600;
      await expect(
        skillRegistry.connect(issuer1).issueCredential(user1.address, 0, pastTimestamp, "ipfs://meta")
      ).to.be.revertedWith("Invalid expiry");
    });

    it("should track credentials by address", async function () {
      await skillRegistry.connect(issuer1).issueCredential(user1.address, 0, 0, "ipfs://meta1");
      await skillRegistry.connect(issuer1).issueCredential(user1.address, 0, 0, "ipfs://meta2");

      const creds = await skillRegistry.getCredentialsByAddress(user1.address);
      expect(creds.length).to.equal(2);
    });

    it("should mint Sharp Tokens on credential issuance", async function () {
      await skillRegistry.connect(issuer1).issueCredential(user1.address, 0, 0, "ipfs://meta");

      // issuerReward = 10 SHARP, recipientReward = 5 SHARP
      expect(await sharpToken.balanceOf(issuer1.address)).to.equal(ethers.parseEther("10"));
      expect(await sharpToken.balanceOf(user1.address)).to.equal(ethers.parseEther("5"));
    });
  });

  // ============ Credential Revocation ============

  describe("Credential Revocation", function () {
    beforeEach(async function () {
      await skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata");
      await skillRegistry.connect(issuer1).createTemplate("Test", "Desc", "ipfs://meta");
      await skillRegistry.connect(issuer1).issueCredential(user1.address, 0, 0, "ipfs://cred");
    });

    it("should revoke a credential", async function () {
      await expect(skillRegistry.connect(issuer1).revokeCredential(0))
        .to.emit(skillRegistry, "CredentialRevoked")
        .withArgs(0);

      const cred = await skillRegistry.getCredential(0);
      expect(cred.revoked).to.be.true;
    });

    it("should revert when non-issuer revokes", async function () {
      await expect(
        skillRegistry.connect(user1).revokeCredential(0)
      ).to.be.revertedWith("Not authorized");
    });

    it("should revert on double revocation", async function () {
      await skillRegistry.connect(issuer1).revokeCredential(0);
      await expect(
        skillRegistry.connect(issuer1).revokeCredential(0)
      ).to.be.revertedWith("Already revoked");
    });
  });

  // ============ Credential Verification ============

  describe("Credential Verification", function () {
    beforeEach(async function () {
      await skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata");
      await skillRegistry.connect(issuer1).createTemplate("Test", "Desc", "ipfs://meta");
    });

    it("should verify a valid credential", async function () {
      await skillRegistry.connect(issuer1).issueCredential(user1.address, 0, 0, "ipfs://cred");
      const [isValid, reason] = await skillRegistry.verifyCredential(0);
      expect(isValid).to.be.true;
      expect(reason).to.equal("Valid");
    });

    it("should fail verification for non-existent credential", async function () {
      const [isValid, reason] = await skillRegistry.verifyCredential(999);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Credential does not exist");
    });

    it("should fail verification for revoked credential", async function () {
      await skillRegistry.connect(issuer1).issueCredential(user1.address, 0, 0, "ipfs://cred");
      await skillRegistry.connect(issuer1).revokeCredential(0);
      const [isValid, reason] = await skillRegistry.verifyCredential(0);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Credential has been revoked");
    });

    it("should fail verification for expired credential", async function () {
      const futureTimestamp = (await ethers.provider.getBlock("latest"))!.timestamp + 3600;
      await skillRegistry.connect(issuer1).issueCredential(
        user1.address, 0, futureTimestamp, "ipfs://cred"
      );

      // Advance time past expiry
      await ethers.provider.send("evm_increaseTime", [7200]);
      await ethers.provider.send("evm_mine");

      const [isValid, reason] = await skillRegistry.verifyCredential(0);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Credential has expired");
    });

    it("should fail verification for deactivated template", async function () {
      await skillRegistry.connect(issuer1).issueCredential(user1.address, 0, 0, "ipfs://cred");
      await skillRegistry.connect(issuer1).deactivateTemplate(0);
      const [isValid, reason] = await skillRegistry.verifyCredential(0);
      expect(isValid).to.be.false;
      expect(reason).to.equal("Template deactivated");
    });
  });

  // ============ SBT Non-Transferability ============

  describe("SBT Non-Transferability", function () {
    beforeEach(async function () {
      await skillRegistry.connect(issuer1).registerIssuer("ipfs://issuer1-metadata");
      await skillRegistry.connect(issuer1).createTemplate("Test", "Desc", "ipfs://meta");
      await skillRegistry.connect(issuer1).issueCredential(user1.address, 0, 0, "ipfs://cred");
    });

    it("should block transferFrom", async function () {
      await expect(
        skillRegistry.connect(user1).transferFrom(user1.address, user2.address, 0)
      ).to.be.revertedWith("SBT: transfer is blocked");
    });

    it("should block approve", async function () {
      await expect(
        skillRegistry.connect(user1).approve(user2.address, 0)
      ).to.be.revertedWith("SBT: approval is blocked");
    });

    it("should block setApprovalForAll", async function () {
      await expect(
        skillRegistry.connect(user1).setApprovalForAll(user2.address, true)
      ).to.be.revertedWith("SBT: approval is blocked");
    });

    it("should report locked status", async function () {
      expect(await skillRegistry.locked(0)).to.be.true;
    });
  });
});
