const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AMM Pool", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();

    const TestToken = await ethers.getContractFactory("TestToken");
    const tokenA = await TestToken.deploy(
      "TokenA",
      "TKA",
      ethers.parseEther("1000000")
    );
    const tokenB = await TestToken.deploy(
      "TokenB",
      "TKB",
      ethers.parseEther("1000000")
    );

    const Pool = await ethers.getContractFactory("Pool");
    const pool = await Pool.deploy(
      await tokenA.getAddress(),
      await tokenB.getAddress()
    );

    await tokenA.transfer(user.address, ethers.parseEther("1000"));
    await tokenB.transfer(user.address, ethers.parseEther("1000"));

    return { owner, user, tokenA, tokenB, pool };
  }

  /* ---------- BASIC ---------- */

  it("adds initial liquidity", async () => {
    const { tokenA, tokenB, pool } = await deployFixture();

    await tokenA.approve(await pool.getAddress(), ethers.parseEther("100"));
    await tokenB.approve(await pool.getAddress(), ethers.parseEther("100"));

    await pool.addLiquidity(
      ethers.parseEther("100"),
      ethers.parseEther("100")
    );

    expect(await pool.reserveA()).to.equal(ethers.parseEther("100"));
    expect(await pool.reserveB()).to.equal(ethers.parseEther("100"));
  });

  it("swaps tokenA for tokenB", async () => {
    const { user, tokenA, tokenB, pool } = await deployFixture();

    await tokenA.approve(await pool.getAddress(), ethers.parseEther("100"));
    await tokenB.approve(await pool.getAddress(), ethers.parseEther("100"));

    await pool.addLiquidity(
      ethers.parseEther("100"),
      ethers.parseEther("100")
    );

    await tokenA
      .connect(user)
      .approve(await pool.getAddress(), ethers.parseEther("10"));

    const deadline = Math.floor(Date.now() / 1000) + 60;

    await pool
      .connect(user)
      .swap(
        await tokenA.getAddress(),
        ethers.parseEther("10"),
        0,
        deadline
      );

    expect(await tokenB.balanceOf(user.address))
      .to.be.gt(ethers.parseEther("1000"));
  });

  it("removes liquidity", async () => {
    const { owner, tokenA, tokenB, pool } = await deployFixture();

    await tokenA.approve(await pool.getAddress(), ethers.parseEther("100"));
    await tokenB.approve(await pool.getAddress(), ethers.parseEther("100"));

    await pool.addLiquidity(
      ethers.parseEther("100"),
      ethers.parseEther("100")
    );

    const lpAddr = await pool.lpToken();
    const lp = await ethers.getContractAt("LPToken", lpAddr);
    const lpBal = await lp.balanceOf(owner.address);

    await lp.approve(await pool.getAddress(), lpBal);
    await pool.removeLiquidity(lpBal);

    expect(await pool.reserveA()).to.equal(0);
    expect(await pool.reserveB()).to.equal(0);
  });

  /* ---------- SLIPPAGE + DEADLINE ---------- */

  it("reverts when slippage is exceeded", async () => {
    const { user, tokenA, tokenB, pool } = await deployFixture();

    await tokenA.approve(await pool.getAddress(), ethers.parseEther("100"));
    await tokenB.approve(await pool.getAddress(), ethers.parseEther("100"));

    await pool.addLiquidity(
      ethers.parseEther("100"),
      ethers.parseEther("100")
    );

    await tokenA
      .connect(user)
      .approve(await pool.getAddress(), ethers.parseEther("10"));

    const deadline = Math.floor(Date.now() / 1000) + 60;

    await expect(
      pool.connect(user).swap(
        await tokenA.getAddress(),
        ethers.parseEther("10"),
        ethers.parseEther("50"),
        deadline
      )
    ).to.be.revertedWith("Slippage exceeded");
  });

  it("reverts when deadline has passed", async () => {
    const { user, tokenA, pool } = await deployFixture();

    await tokenA
      .connect(user)
      .approve(await pool.getAddress(), ethers.parseEther("10"));

    await expect(
      pool.connect(user).swap(
        await tokenA.getAddress(),
        ethers.parseEther("10"),
        0,
        1
      )
    ).to.be.revertedWith("Expired");
  });

  /* ---------- ROUTER ---------- */

  it("router swaps tokens correctly", async () => {
    const { user, tokenA, tokenB, pool } = await deployFixture();

    const Router = await ethers.getContractFactory("Router");
    const router = await Router.deploy();

    await tokenA.approve(await pool.getAddress(), ethers.parseEther("100"));
    await tokenB.approve(await pool.getAddress(), ethers.parseEther("100"));

    await pool.addLiquidity(
      ethers.parseEther("100"),
      ethers.parseEther("100")
    );

    await tokenA
      .connect(user)
      .approve(await router.getAddress(), ethers.parseEther("10"));

    const deadline = Math.floor(Date.now() / 1000) + 60;

    await router
      .connect(user)
      .swapExactTokensForTokens(
        await pool.getAddress(),
        await tokenA.getAddress(),
        ethers.parseEther("10"),
        0,
        deadline
      );

    expect(await tokenB.balanceOf(user.address))
      .to.be.gt(ethers.parseEther("1000"));
  });

  /* ---------- LP FEES ---------- */

  it("LPs earn fees over time", async () => {
  const { owner, user, tokenA, tokenB, pool } = await deployFixture();

  await tokenA.approve(await pool.getAddress(), ethers.parseEther("100"));
  await tokenB.approve(await pool.getAddress(), ethers.parseEther("100"));

  await pool.addLiquidity(
    ethers.parseEther("100"),
    ethers.parseEther("100")
  );

  const lpAddr = await pool.lpToken();
  const lp = await ethers.getContractAt("LPToken", lpAddr);

  const lpBefore = await lp.balanceOf(owner.address);

  await tokenA
    .connect(user)
    .approve(await pool.getAddress(), ethers.parseEther("10"));

  const block = await ethers.provider.getBlock("latest");
  const deadline = block.timestamp + 1000;

  await pool
    .connect(user)
    .swap(
      await tokenA.getAddress(),
      ethers.parseEther("10"),
      0,
      deadline
    );

  await lp.approve(await pool.getAddress(), lpBefore);
  await pool.removeLiquidity(lpBefore);

  const balanceAAfter = await tokenA.balanceOf(owner.address);

  expect(balanceAAfter).to.be.gt(
    ethers.parseEther("1000")
  );
});

});