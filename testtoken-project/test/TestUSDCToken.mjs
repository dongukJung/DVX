import { expect } from "chai";

describe("TestUSDCToken Contract", function () {
  let TestUSDC, testToken, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    TestUSDC = await ethers.getContractFactory("TestUSDC");
    testToken = await TestUSDC.deploy();
    await testToken.deployed();
  });

  it("Should deploy without initial supply", async function () {
    const ownerBalance = await testToken.balanceOf(owner.address);
    const totalSupply = await testToken.totalSupply();
    expect(ownerBalance.eq(ethers.BigNumber.from("0"))).to.be.true;
    expect(totalSupply.eq(ethers.BigNumber.from("0"))).to.be.true;
  });

  it("Should mint and burn tokens", async function () {
    const mintAmount = ethers.BigNumber.from("1000");
    const mintTx = await testToken.mint(user.address, mintAmount);
    await mintTx.wait();
    const userBalance = await testToken.balanceOf(user.address);
    expect(userBalance.eq(mintAmount)).to.be.true;
	  
    const burnAmount = ethers.BigNumber.from("100");
    const burnTx = await testToken.burn(user.address, burnAmount);
    await burnTx.wait();
    const finalBalance = await testToken.balanceOf(user.address);
    const expectedBalance = userBalance.sub(burnAmount);
    expect(finalBalance.eq(expectedBalance)).to.be.true;
  });


  it("Should permit token allowance via signature", async function () {
    const amount = ethers.BigNumber.from("1000");
    const deadline = ethers.constants.MaxUint256;
    const nonce = await testToken.nonces(owner.address);
    const name = await testToken.name();
    const version = "1";
    const chainId = (await ethers.provider.getNetwork()).chainId;

    const domain = {
      name,
      version,
      chainId,
      verifyingContract: testToken.address,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      owner: owner.address,
      spender: user.address,
      value: amount,
      nonce: nonce,
      deadline: deadline,
    };

    // EIP-712 타입 데이터로 서명 생성
    const signature = await owner._signTypedData(domain, types, message);
    const { v, r, s } = ethers.utils.splitSignature(signature);

    // 서명 사용하여 허가
    const permitTx = await testToken.permit(owner.address, user.address, amount, deadline, v, r, s);
    await permitTx.wait();

    // 허가된 토큰 수량 확인
    const allowance = await testToken.allowance(owner.address, user.address);
    expect(allowance.eq(amount)).to.be.true;
  });

});

