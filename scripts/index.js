const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const V2_PAIR_ADDRESS = "0x3356c9A8f40F8E9C1d192A4347A76D18243fABC5";
const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

const TOKEN_HOLDER = "0x23f4569002a5A07f0Ecf688142eEB6bcD883eeF8";

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const constants = async () => {
  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

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
    "IUniswapV2Router02",
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

  return {
    impersonatedSigner,
    USDC_CONTRACT,
    ROUTER,
    DAI_CONTRACT,
    V2_FACTORY,
    V2_PAIR,
    DAI_CONTRACT,
    USDC_CONTRACT,
  };
};

const addLiquidity = async (
  tokenA,
  tokenB,
  amountADesired,
  amountBDesired,
  amountAMin,
  amountBMin,
  to,
  deadline
) => {
    const { ROUTER } = await constants();
  try {
    await ROUTER.addLiquidity(
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline
    );
  } catch (error) {
    return error;
  }
};

const removeLiquidity = async () => {};

const addLiquidityETH = async () => {};

const removeLiquidityETH = async () => {};

const removeLiquidityWithPermit = async () => {};

const removeLiquidityETHWithPermit = async () => {};

const removeLiquidityETHSupportingFeeOnTransferTokens = async () => {};

const removeLiquidityETHWithPermitSupportingFeeOnTransferTokens =
  async () => {};

const swapExactTokensForTokens = async () => {};

const swapTokensForExactTokens = async () => {};

const swapExactETHForTokens = () => {};

const swapExactTokensForETH = async () => {};

const swapETHForExactTokens = async () => {};

const swapExactTokensForTokensSupportingFeeOnTransferTokens = async () => {};

const swapExactETHForTokensSupportingFeeOnTransferTokens = async () => {};

const swapExactTokensForETHSupportingFeeOnTransferTokens = async () => {};

module.exports = {
  V2_PAIR_ADDRESS,
  ROUTER_ADDRESS,
  FACTORY_ADDRESS,
  TOKEN_HOLDER,
  USDC,
  DAI,
  addLiquidity,
  removeLiquidity,
  addLiquidityETH,
  removeLiquidityETH,
  removeLiquidityWithPermit,
  removeLiquidityETHWithPermit,
  removeLiquidityETHSupportingFeeOnTransferTokens,
  removeLiquidityETHWithPermitSupportingFeeOnTransferTokens,
  swapExactTokensForTokens,
  swapTokensForExactTokens,
  swapExactETHForTokens,
  swapExactTokensForETH,
  swapETHForExactTokens,
  swapExactTokensForTokensSupportingFeeOnTransferTokens,
  swapExactETHForTokensSupportingFeeOnTransferTokens,
  swapExactTokensForETHSupportingFeeOnTransferTokens,
  constants
};
