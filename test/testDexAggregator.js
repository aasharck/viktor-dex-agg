const { ethers } = require("hardhat");

require('chai')
    .use(require('chai-as-promised'))
    .should()


const wethContractAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const usdcContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("Number Contract", function () {

  let dexAggregatorContract

  beforeEach(async () => {
    const DexAggregator = await ethers.getContractFactory("DexAggregator");
    dexAggregatorContract = await DexAggregator.deploy();

    await dexAggregatorContract.deployed();
  })

  it("Should return uni rate for weth/usdc swap", async function () {
    const path = ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]
    const amount = "1000000000000000000"
    
    const uniRate = await dexAggregatorContract.uniRate(path,amount)
    console.log("uni rate = ", uniRate.toString())
  });


  it("Should return sushi rate for weth/usdc swap", async function () {
    const path = ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]
    const amount = "1000000000000000000"
    const sushiRate = await dexAggregatorContract.sushiRate(path,amount)
    console.log("sushi rate = ", sushiRate.toString())
    sushiRate.toString().should.not.equal(0)
  });


  it("Should return the cheaper exchange", async function () {
    const path = ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]
    const amount = "1000000000000000000"
    const cheaperRate = await dexAggregatorContract.getHighestAmountOut(path,amount)

    console.log(`The cheaper rate is ${cheaperRate[1]}  on the ${cheaperRate[0] ? "sushi" : "uni"} exchange`)

    const uniRate = await dexAggregatorContract.uniRate(path,amount)
    const sushiRate = await dexAggregatorContract.sushiRate(path,amount)

    if(uniRate.toString() > sushiRate.toString()) {
      cheaperRate[1].should.equal(uniRate.toString())
    } else {
      cheaperRate[1].should.equal(sushiRate.toString())
    }
  });  

  const interfaceERC20 = [
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount)",
    "function approve(address spender, uint256 amount) public virtual override returns (bool)"
];

  it("Should make the swap", async function () {
    const impersonatedAccountAddress = "0xCFFAd3200574698b78f32232aa9D63eABD290703"

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [impersonatedAccountAddress],
    });
    const signer = await ethers.getSigner(impersonatedAccountAddress)

    const provider = ethers.getDefaultProvider();
    const usdcContract = new ethers.Contract(usdcContractAddress, interfaceERC20, provider);

    
    await usdcContract.connect(signer).transfer(usdcContractAddress, "1");
    await dexAggregatorContract.connect(signer).usdcToWeth("1");

  });
});
