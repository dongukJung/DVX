async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TestToken
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy();
  await testToken.deployed();
  console.log("TestToken deployed to:", testToken.address);

  // Deploy TestUSDC
  const TestUSDCToken = await ethers.getContractFactory("TestUSDC");
  const testUSDC = await TestUSDCToken.deploy();
  await testUSDC.deployed();
  console.log("TestUSDCToken deployed to:", testUSDC.address);

  // Deploy TestStaking
  const TestStaking = await ethers.getContractFactory("TestStaking");
  const testStaking = await TestStaking.deploy(testToken.address, testUSDC.address, 1)
  await testStaking.deployed();
  console.log("TestStaking deployed to:", testStaking.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
