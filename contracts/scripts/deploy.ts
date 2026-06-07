import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy MockSharpToken
  const MockSharpToken = await ethers.getContractFactory("MockSharpToken");
  const sharpToken = await MockSharpToken.deploy(deployer.address);
  await sharpToken.waitForDeployment();
  const sharpTokenAddr = await sharpToken.getAddress();
  console.log("MockSharpToken deployed to:", sharpTokenAddr);

  // 2. Deploy SkillRegistry
  const SkillRegistry = await ethers.getContractFactory("SkillRegistry");
  const skillRegistry = await SkillRegistry.deploy(deployer.address);
  await skillRegistry.waitForDeployment();
  const skillRegistryAddr = await skillRegistry.getAddress();
  console.log("SkillRegistry deployed to:", skillRegistryAddr);

  // 3. Deploy SharpTokenIntegrator
  const SharpTokenIntegrator = await ethers.getContractFactory("SharpTokenIntegrator");
  const integrator = await SharpTokenIntegrator.deploy(
    sharpTokenAddr,
    skillRegistryAddr,
    deployer.address
  );
  await integrator.waitForDeployment();
  const integratorAddr = await integrator.getAddress();
  console.log("SharpTokenIntegrator deployed to:", integratorAddr);

  // 4. Wire contracts together
  // Grant integrator mint/burn role on SharpToken
  // (MockSharpToken onlyOwner, so we need to transfer ownership or handle it)
  // For now, the integrator calls mint/burn which requires owner
  // We'll transfer MockSharpToken ownership to integrator
  await sharpToken.transferOwnership(integratorAddr);
  console.log("SharpToken ownership transferred to integrator");

  // Set integrator on SkillRegistry
  await skillRegistry.setTokenIntegrator(integratorAddr);
  console.log("TokenIntegrator set on SkillRegistry");

  console.log("\n=== Deployment Complete ===");
  console.log("MockSharpToken:", sharpTokenAddr);
  console.log("SkillRegistry:", skillRegistryAddr);
  console.log("SharpTokenIntegrator:", integratorAddr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
