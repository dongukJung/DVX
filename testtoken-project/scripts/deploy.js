async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const initialOwner = deployer.address

  // Deploy TestToken
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy(initialOwner);
  await testToken.deployed();
  console.log("TestToken deployed to:", testToken.address);

  // Deploy TestUSDCToken
  const TestUSDCToken = await ethers.getContractFactory("TestUSDCToken");
  const testUSDC = await TestUSDCToken.deploy(initialOwner);
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
