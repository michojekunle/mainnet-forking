const {
  addLiquidity,
  addLiquidityETH,
  constants,
  USDC,
  DAI,
  removeLiquidity,
  removeLiquidityETH,
} = require(".");
const { ethers } = require("hardhat");

async function main() {
  const {
    impersonatedSigner,
    V2_PAIR,
    V2_FACTORY,
    USDC_CONTRACT,
    DAI_CONTRACT,
    ROUTER,
    WETH,
  } = await constants();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  //addliquidity
  const amountUSDCDesiredAddl = ethers.parseUnits("2", 6);
  const amountDAIDesiredAddl = ethers.parseUnits("2", 18);
  // slippage to calcuate min amounts
  const slippageTolerance = 0.8; // 90%
  const amountUSDCMin =
    (amountUSDCDesiredAddl * BigInt(1000 - slippageTolerance * 1000)) /
    BigInt(1000);
  const amountDAIMin =
    (amountDAIDesiredAddl * BigInt(1000 - slippageTolerance * 1000)) /
    BigInt(1000);

  // adliquidityETH
  const amountTokenDesired = ethers.parseUnits("100", 6);
  const amountTokenMin =
    (amountTokenDesired * BigInt(1000 - slippageTolerance * 1000)) /
    BigInt(1000);
  const amountETHMin = ethers.parseEther("0.01");

  console.log(amountTokenMin - amountTokenDesired);

  //  Remove liquidity and remove Remove liquidity ETH
  const amountUSDCDesiredRemL = ethers.parseUnits("2", 6);
  const amountUSDCMinRemL = ethers.parseUnits("1", 6);
  const amountDAIDesiredRemL = ethers.parseUnits("2", 18);
  const amountDAIMinRemL = ethers.parseUnits("0.5", 18);

  let liquidityRemL = ethers.parseUnits("1", 18);
  const amountTokenMinRemL = ethers.parseUnits("0.3", 6);
  const amountETHMinRemL = ethers.parseEther("0.00000003");

  // Approve
  await USDC_CONTRACT.approve(ROUTER, amountUSDCDesiredAddl);
  await DAI_CONTRACT.approve(ROUTER, amountDAIDesiredAddl);

  const usdcBalAddl = await USDC_CONTRACT.balanceOf(impersonatedSigner);
  const daiBalAddl = await DAI_CONTRACT.balanceOf(impersonatedSigner);

  console.log(
    "balance before adding liquidity",
    "\nUSDC:",
    Number(usdcBalAddl),
    "\nDAI:",
    Number(daiBalAddl)
  );

  if (
    usdcBalAddl < amountUSDCDesiredAddl ||
    daiBalAddl < amountDAIDesiredAddl
  ) {
    throw new Error("Insufficient amount of tokens for adding liquidity");
  }

  const addLiquidityTx = await addLiquidity(
    USDC,
    DAI,
    amountUSDCDesiredAddl,
    amountDAIDesiredAddl,
    amountUSDCMin,
    amountDAIMin,
    impersonatedSigner.address,
    deadline
  );

  console.log("Liquidity added successfully.");

  // console.log("Add Liquidity tx", addLiquidityTx);
  const nameAddl = await V2_PAIR.name();
  const symbolAddl = await V2_PAIR.symbol();
  const pairAddl = await V2_FACTORY.getPair(USDC, DAI);

  const usdcBalAfterAddl = await USDC_CONTRACT.balanceOf(impersonatedSigner);
  const daiBalAfterAddl = await DAI_CONTRACT.balanceOf(impersonatedSigner);

  // console.log("========================================");

  // console.log("Liquidity pair NAME", nameAddl);
  // console.log("Liquidity pair SYMBOL", symbolAddl);
  console.log("Liquidity Pair", pairAddl);

  // console.log("========================================");

  console.log(
    "balance after adding liquidity",
    "\nUSDC:",
    Number(usdcBalAfterAddl),
    "\nDAI:",
    Number(daiBalAfterAddl)
  );

  const balBeforeAddlETH = await ethers.provider.getBalance(
    impersonatedSigner.address
  );
  console.log("Balance after adding liquidity eth", balBeforeAddlETH);

  await USDC_CONTRACT.approve(ROUTER, amountTokenDesired);

  // token,
  // amountTokenDesired,
  // amountTokenMin,
  // amountETHMin,
  // to,
  // deadline
  const addLiquidityETHTx = await addLiquidityETH(
    USDC,
    amountTokenDesired,
    amountTokenMin,
    amountETHMin,
    impersonatedSigner.address,
    deadline
  );

  console.log("Liquidity ETH added successfully.");

  const pairAddlETH = await V2_FACTORY.getPair(USDC, WETH);

  console.log("Weth & usdc pair", pairAddlETH);

  console.log("========================================");
  console.log("Add liquidity ETH", addLiquidityETHTx);
  console.log("========================================");

  const balAfterAddlETH = await ethers.provider.getBalance(
    impersonatedSigner.address
  );
  console.log("Balance after adding liquidity eth", balAfterAddlETH);

  await USDC_CONTRACT.approve(ROUTER, amountUSDCDesiredRemL);
  await DAI_CONTRACT.approve(ROUTER, amountDAIDesiredRemL);

  const usdcBalRemL = await USDC_CONTRACT.balanceOf(impersonatedSigner);
  const daiBalRemL = await DAI_CONTRACT.balanceOf(impersonatedSigner);

  const pairContract = await ethers.getContractAt(
    "IERC20",
    pairAddl,
    impersonatedSigner
  );
  const liquidityBalance = await pairContract.balanceOf(impersonatedSigner);
  if (liquidityBalance < liquidityRemL) {
    liquidityRemL = liquidityBalance / BigInt(2);
    console.log(
      "Insufficient liquidity tokens for removal",
      liquidityBalance,
      liquidityRemL
    );
  }

  pairContract.approve(ROUTER, liquidityBalance);

  console.log(
    "balance before removing liquidity",
    "\nUSDC:",
    Number(usdcBalRemL),
    "\nDAI:",
    Number(daiBalRemL)
  );

  console.log(
    "balance check before removing liquidity",
    "\nUSDC:",
    Number(usdcBalRemL) > Number(amountUSDCDesiredRemL),
    "\nDAI:",
    Number(daiBalRemL) > Number(amountDAIDesiredRemL)
  );

  if (
    usdcBalRemL < amountUSDCDesiredRemL ||
    daiBalRemL < amountDAIDesiredRemL
  ) {
    console.error("Insufficient amount of tokens for removing liquidity");
    return;
  }

  // tokenA,
  // tokenB,
  // liquidity,
  // amountAMin,
  // amountBMin,
  // to,
  // deadline
  const removeLiquidityTx = await removeLiquidity(
    USDC,
    DAI,
    liquidityRemL,
    0,
    0,
    impersonatedSigner.address,
    deadline
  );

  console.log("Remove LIquidity Tx", removeLiquidityTx);

  const usdcBalRemLAfter = await USDC_CONTRACT.balanceOf(impersonatedSigner);
  const daiBalRemLAfter = await DAI_CONTRACT.balanceOf(impersonatedSigner);

  console.log("========================================");

  console.log(
    "balance after adding liquidity",
    "\nUSDC:",
    Number(usdcBalRemLAfter),
    "\nDAI:",
    Number(daiBalRemLAfter)
  );

  let liquidityEthRemL = ethers.parseUnits("1", 18);

  const pairContractWETH = await ethers.getContractAt(
    "IERC20",
    pairAddlETH,
    impersonatedSigner
  );
  const liquidityBalanceWETH = await pairContractWETH.balanceOf(
    impersonatedSigner
  );
  if (liquidityBalanceWETH < liquidityEthRemL) {
    liquidityEthRemL = liquidityBalanceWETH / BigInt(2);
    console.log(
      "Insufficient liquidity tokens for removal",
      liquidityBalance,
      liquidityRemL
    );
  }

  pairContractWETH.approve(ROUTER, liquidityBalanceWETH);

  // token,
  // liquidity,
  // amountTokenMin,
  // amountETHMin,
  // to,
  // deadline
  const removeLiquidityETHTx = await removeLiquidityETH(
    USDC,
    liquidityEthRemL,
    0,
    0,
    impersonatedSigner.address,
    deadline
  );

  console.log("========================================");
  console.log("remove Liquidity ETH Tx", removeLiquidityETHTx);
  console.log("========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
