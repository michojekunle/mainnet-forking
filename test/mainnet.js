const { ethers } = require("hardhat");

describe("Mainnet Forking Example", function () {
  it("Should fetch USDT balance", async function () {
    // USDT token contract address on Ethereum mainnet
    const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const usdt = await ethers.getContractAt("IERC20", usdtAddress);

    // Some address that holds USDT on the mainnet
    const addressWithUSDT = "0x53F414Bb2a1583e153DfCC27Cbd7af2E9f253265";

    const balance = await usdt.balanceOf(addressWithUSDT);
    console.log("USDT Balance:", balance.toString());
  });
});
