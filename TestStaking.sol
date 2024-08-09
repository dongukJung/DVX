
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TestToken.sol"
import "./TestUSDCToken.sol"

contract TestStaking is Ownable {
    IERC20 public stakingToken; // TestToken
    IERC20 public rewardToken; // TestUSDC

    uint256 public rewardRate; // Reward coefficient proportional to voting power
    uint256 public nftId; // Incremental ID for NFT

    struct Stake {
	uint256 tokenAmount;
	uint256 startTime;
	uint256 lockDuration;
    }

    mapping(uint256 => Stake) public stakes; // nft ID to stake info
    mapping(address => uint256) public votingPower; // user address to voting power

    constructor(
	    address _stakingToken,
	    address _rewardToken,
	    uint256 _rewardRate
    ) ERC721("StakeNFT", "SNFT"){
        stakingToken = IERC20(_stakingToken); // TestToken
        rewardToken = IERC20(_rewardToken); // TestUSDC
	rewardRate = _rewardRate
	nftId = 1;
    }

    function stake(uint256 lockDuration, uint256 tokenAmount) external {
	// Stake {tokenAmount} tokenAmount for {lockDuration}

        require(tokenAmount > 0, "Cannot stake 0");
	require(lockDuration >= 1 days && lockDuration <= 7 days, "You can only stake for 1~7 days");

	// Mint a new NFT
	_safeMint(msg.sender, nftId);

	// Save the staking info
	stakes[nftId].push(Stake({
		tokenAmount: tokenAmount,
		startTime: block.timestamp,
		lockDuration: lockDuration
	}));

	nftId++;

	// Transfer token to staking account from user's account
        stakingToken.transferFrom(msg.sender, address(this), tokenAmount);

	// User gain votingPower as soon as they stakes
	votingPower[msg.sender] += lockDuration * tokenAmount;
    }

    function unstake(uint256 tokenId) external {
	// Unstake the staked token

	require(_exists(tokenId), "Invalid NFT Id");
	require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");

	Stake storage userStake = stakes[tokenId];

	require(block.timestamp >= userStake.startTime + userStake.lockDuration, "Lock duration is not over yet";

	delete stakes[tokenId];

	stakingToken.transfer(msg.sender, userStake.tokenAmount);

    }

    function getRewardFromVotingPower(uint256 votingPowerAmount) external {
	// Get reward from given voting power

	require(votingPower[msg.sender] >= votingPowerAmount, "Not enough voting power");

	votingPower[msg.sender] -= votingPowerAmount;
	rewardTokenAmount = rewardRate * votingPowerAmount;

	if (rewardTokenAmount > 0){
	    rewardToken.mint(msg.sender, rewardTokenAmount);
	}
    }
}
