const  {
  loadFixture,
} = require ("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } =  require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const { USDC, DAI, ROUTER_ADDRESS, constants } = require("../scripts");

describe("UseSwap", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployUseSwap() {
    const [owner] = await hre.ethers.getSigners();

    const { USDC_CONTRACT, ROUTER, impersonatedSigner } = await constants();

    const UseSwap = await hre.ethers.getContractFactory("UseSwap");
    const useSwap = await UseSwap.deploy(ROUTER_ADDRESS);

    return { useSwap, owner, ROUTER, USDC_CONTRACT, impersonatedSigner };
  }

  describe("Deployment UseSwap", function () {
    it("Should set the right router address", async function () {
      const { useSwap, ROUTER, USDC_CONTRACT, impersonatedSigner } = await loadFixture(deployUseSwap);

      const amountOut = ethers.parseUnits("20", 18);
      // using amountsIn function of the uniswap v2 router get the amountsIn(USDC) required for the amountOut(DAI)
      const amounts = await ROUTER.getAmountsIn(amountOut, [USDC, DAI]);
      let amountInMax = amounts[0];

      // Increase slippage tolerance (e.g., allow 5% slippage)
      amountInMax = amountInMax * BigInt(105) / BigInt(100);

      const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

      await USDC_CONTRACT.approve(useSwap, amountInMax);

      const tx = await useSwap.connect(impersonatedSigner).handleSwap(amountOut, amountInMax, [USDC, DAI], impersonatedSigner, deadline);

      tx.wait();

      const amounts2 = await ROUTER.getAmountsIn(amountOut, [USDC, DAI]);
      let amountInMax2 = amounts2[0];

      // Increase slippage tolerance (e.g., allow 5% slippage)
      amountInMax2 = amountInMax2 * BigInt(105) / BigInt(100);

      await USDC_CONTRACT.approve(useSwap, amountInMax2);
      
      const tx1 = await useSwap.connect(impersonatedSigner).handleSwap(amountOut, amountInMax2, [USDC, DAI], impersonatedSigner.address, deadline);

      tx1.wait();

      expect(await useSwap.uniswapRouter()).to.equal(ROUTER_ADDRESS);
      expect(await useSwap.swapCount()).to.equal(2);

    });
  });
});
