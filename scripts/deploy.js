const hre = require("hardhat");

async function main() {

  const DexAggregator = await hre.ethers.getContractFactory("DexAggregator");
  const dexAggregator = await DexAggregator.deploy();

  await dexAggregator.deployed();

  console.log("DexAggregator deployed to:", dexAggregator.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
