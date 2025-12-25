// const { ethers } = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const TestToken = await ethers.getContractFactory("TestToken");
  const tokenA = await TestToken.deploy("TokenA", "TKA", ethers.parseEther("1000000"));
  await tokenA.waitForDeployment();

  const tokenB = await TestToken.deploy("TokenB", "TKB", ethers.parseEther("1000000"));
  await tokenB.waitForDeployment();

  const Pool = await ethers.getContractFactory("Pool");
  const pool = await Pool.deploy(await tokenA.getAddress(), await tokenB.getAddress());
  await pool.waitForDeployment();

  const Router = await ethers.getContractFactory("Router");
  const router = await Router.deploy();
  await router.waitForDeployment();

  console.log("\n=== DEPLOYED ADDRESSES ===");
  console.log("TOKEN_A:", await tokenA.getAddress());
  console.log("TOKEN_B:", await tokenB.getAddress());
  console.log("POOL   :", await pool.getAddress());
  console.log("ROUTER :", await router.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});