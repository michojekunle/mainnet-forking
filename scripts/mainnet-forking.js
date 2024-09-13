const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const TOKEN_HOLDER = "0x23f4569002a5A07f0Ecf688142eEB6bcD883eeF8";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const amountOut = ethers.parseUnits("20", 18);
  const amountInMax = ethers.parseUnits("1980", 6);

  const USDC_CONTRACT = await ethers.getContractAt(
    "IERC20",
    USDC,
    impersonatedSigner
  );
  const DAI_CONTRACT = await ethers.getContractAt("IERC20", DAI);

  const ROUTER = await ethers.getContractAt(
    "IUniswap",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  USDC_CONTRACT.approve(ROUTER, amountOut);

  const usdcBal = await USDC_CONTRACT.balanceOf(impersonatedSigner);
  const daiBal = await DAI_CONTRACT.balanceOf(impersonatedSigner);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log("balance before swap", "\nUSDC:", Number(usdcBal), "\nDAI:", Number(daiBal));

  await ROUTER.swapTokensForExactTokens(
    amountOut,
    amountInMax,
    [USDC, DAI],
    impersonatedSigner,
    deadline
  );

  const usdcBalAfter = await USDC_CONTRACT.balanceOf(
    impersonatedSigner
  );
  const daiBalAfter = await DAI_CONTRACT.balanceOf(impersonatedSigner);

  console.log("========================================")

  console.log(
    "balance after swap",
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
