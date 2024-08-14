import { expect } from "chai";

describe("TestStaking Contract", function () {
    let TestToken;
    let TestUSDC;
    let TestStaking;
    let stakingToken;
    let rewardToken;
    let testStaking;
    let owner, user1, user2;
    let rewardRate;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // TestToken Contract 배포
        TestToken = await ethers.getContractFactory("TestToken");
        stakingToken = await TestToken.deploy();
        await stakingToken.deployed();

        // TestUSDC Contract 배포
        TestUSDC = await ethers.getContractFactory("TestUSDC");
        rewardToken = await TestUSDC.deploy();
        await rewardToken.deployed();

        // TestStaking Contract 배포
	rewardRate = 1;
        TestStaking = await ethers.getContractFactory("TestStaking");
        testStaking = await TestStaking.deploy(stakingToken.address, rewardToken.address, rewardRate);
        await testStaking.deployed();

        // TestTokend을 user에게 전송
        await (await stakingToken.transfer(user1.address, ethers.BigNumber.from("1000"))).wait();
    });

    it("Should allow staking tokens", async function () {
        // user1이 스테이킹을 수행
	const lockDuration = ethers.BigNumber.from("86400"); // 1 day
	const stakingAmount = ethers.BigNumber.from("100");

        await (await stakingToken.connect(user1).approve(testStaking.address, stakingAmount)).wait();
        await (await testStaking.connect(user1).stake(lockDuration, stakingAmount)).wait();

        const stakeInfo = await testStaking.stakes(1); // NFT ID 1

        expect(stakeInfo.tokenAmount.eq(stakingAmount)).to.be.true;
        expect(stakeInfo.startTime.toNumber()).to.be.gt(0);
        expect(stakeInfo.lockDuration.eq(lockDuration)).to.be.true;
    });

    it("Should allow unstaking tokens", async function () {
        const initalBalance = await stakingToken.balanceOf(user1.address);

        // user1이 스테이킹을 수행
	const lockDuration = ethers.BigNumber.from("86400"); // 1 day
	const stakingAmount = ethers.BigNumber.from("100");

        await (await stakingToken.connect(user1).approve(testStaking.address, stakingAmount)).wait();
        await (await testStaking.connect(user1).stake(lockDuration, stakingAmount)).wait();

        // 대기: 충분한 시간 경과
        // TODO(donguk) : baobob 에서는 evm_IncreaseTime 이 아직 동작하지 않는듯..
        await ethers.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]); // 1일
        await ethers.provider.send("evm_mine"); // 블록 마이닝

        await (await testStaking.connect(user1).unstake(1)).wait(); // NFT ID 1으로 언스테이킹

        const balance = await stakingToken.balanceOf(user1.address);
        expect(balance.eq(initalBalance)).to.be.true; // 1000 + 100
    });

    it.only("Should calculate and distribute rewards based on voting power", async function () {
        // user1이 스테이킹을 수행
	const lockDuration = ethers.BigNumber.from("86400"); // 1 day
	const stakingAmount = ethers.BigNumber.from("100");
        await (await stakingToken.connect(user1).approve(testStaking.address, stakingAmount)).wait();
        await (await testStaking.connect(user1).stake(lockDuration, stakingAmount)).wait();

	const votingPowerAmount = ethers.BigNumber.from("100");
        await (await testStaking.connect(user1).getRewardFromVotingPower(votingPowerAmount)).wait(); // 100 voting power로 리워드 요청

        const rewardBalance = await rewardToken.balanceOf(user1.address);
	const expectedBalance = votingPowerAmount.mul(rewardRate);

        expect(rewardBalance.eq(expectedBalance)).to.be.true;
    });

    it("Should not allow unstaking before lock duration ends", async function () {
        // user1이 스테이킹을 수행
	const lockDuration = ethers.BigNumber.from("86400"); // 1 day
	const stakingAmount = ethers.BigNumber.from("100");

        await (await stakingToken.connect(user1).approve(testStaking.address, stakingAmount)).wait();
        await (await testStaking.connect(user1).stake(lockDuration, stakingAmount)).wait();

        // 충분한 시간 경과 전 언스테이킹 시도
	try {
	    await testStaking.connect(user1).unstake(1);
            expect.fail("Error not received");
	} catch (error) {
	    expect(error.message).to.include("Lock duration is not over yet");
	}
    });
});

