const { addLiquidity, constants, USDC, DAI } = require(".");

async function main() {
  const { impersonatedSigner, V2_PAIR, V2_FACTORY, USDC_CONTRACT, DAI_CONTRACT, ROUTER } = await constants();

  const amountUSDCDesired = ethers.parseUnits("2", 6);
  const amountUSDCMin = ethers.parseUnits("1", 6);
  const amountDAIDesired = ethers.parseUnits("2", 18);
  const amountDAIMin = ethers.parseUnits("0.5", 18);

  await USDC_CONTRACT.approve(ROUTER, amountUSDCDesired);
  await DAI_CONTRACT.approve(ROUTER, amountDAIDesired);

  const usdcBal = await USDC_CONTRACT.balanceOf(impersonatedSigner);
  const daiBal = await DAI_CONTRACT.balanceOf(impersonatedSigner);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log(
    "balance before adding liquidity",
    "\nUSDC:",
    Number(usdcBal),
    "\nDAI:",
    Number(daiBal)
  );

  console.log(
    "balance check before adding liquidity",
    "\nUSDC:",
    Number(usdcBal) > Number(amountUSDCDesired),
    "\nDAI:",
    Number(daiBal) > Number(amountDAIDesired)
  );

  if (usdcBal < amountUSDCDesired || daiBal < amountDAIDesired) {
    console.error("Insufficient amount of tokens for adding liquidity");
    return;
  }

  const addLiquidityTx = await addLiquidity(
    USDC,
    DAI,
    amountUSDCDesired,
    amountDAIDesired,
    amountUSDCMin,
    amountDAIMin,
    impersonatedSigner.address,
    deadline
  );

  console.log(addLiquidityTx);

  const name = await V2_PAIR.name();
  const symbol = await V2_PAIR.symbol();
  const pair = await V2_FACTORY.getPair(USDC, DAI);

  const usdcBalAfter = await USDC_CONTRACT.balanceOf(impersonatedSigner);
  const daiBalAfter = await DAI_CONTRACT.balanceOf(impersonatedSigner);

  console.log("========================================");

  console.log("Liquidity pair NAME", name);
  console.log("Liquidity pair SYMBOL", symbol);
  console.log("Liquidity Pair", pair);

  console.log("========================================");

  console.log(
    "balance after adding liquidity",
    "\nUSDC:",
    Number(usdcBalAfter),
    "\nDAI:",
    Number(daiBalAfter)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
