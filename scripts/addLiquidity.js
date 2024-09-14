const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const V2_PAIR_ADDRESS = "0x3356c9A8f40F8E9C1d192A4347A76D18243fABC5";
  const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const TOKEN_HOLDER = "0x23f4569002a5A07f0Ecf688142eEB6bcD883eeF8";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const amountUSDCDesired = ethers.parseUnits("2", 6);
  const amountUSDCMin = ethers.parseUnits("1", 6);
  const amountDAIDesired = ethers.parseUnits("5", 18);
  const amountDAIMin = ethers.parseUnits("4", 18);

  const USDC_CONTRACT = await ethers.getContractAt(
    "IERC20",
    USDC,
    impersonatedSigner
  );
  const DAI_CONTRACT = await ethers.getContractAt(
    "IERC20",
    DAI,
    impersonatedSigner
  );

  const ROUTER = await ethers.getContractAt(
    "IUniswap",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  const V2_PAIR = await ethers.getContractAt(
    "IUniswapV2Pair",
    V2_PAIR_ADDRESS,
    impersonatedSigner
  );

  const V2_FACTORY = await ethers.getContractAt(
    "IUniswapV2Factory",
    FACTORY_ADDRESS,
    impersonatedSigner
  );

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
    Number(usdcBal) > Number(amountUSDCInMax),
    "\nDAI:",
    Number(daiBal) > Number(amountDAIInMax)
  );

  if(usdcBal < amountUSDCInMax || daiBal < amountDAIInMax){
    console.error("Insufficient amount of tokens for adding liquidity");
    return;
  }

  await ROUTER.addLiquidity(
    USDC,
    DAI,
    amountUSDCDesired,
    amountDAIDesired,
    amountUSDCMin,
    amountDAIMin,
    impersonatedSigner,
    deadline
  );

  const name = await V2_PAIR.name();
  const symbol = await V2_PAIR.symbol();
  const pair = await V2_FACTORY.getPair(USDC, DAI);

  const usdcBalAfter = await USDC_CONTRACT.balanceOf(impersonatedSigner);
  const daiBalAfter = await DAI_CONTRACT.balanceOf(impersonatedSigner);

  console.log("========================================");

  console.log("Liquidity pair NAME", name);
  console.log("Liquidity pair SYMBOL", symbol);
  console.log("Liquidity Pair", pair);

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
