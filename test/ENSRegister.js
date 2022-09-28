const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

describe("ENSRegistryTests", function () {
  async function deployENSRegistryFixture() {
    // Get the ContractFactory and Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();
    const ENSRegistry = await ethers.getContractFactory("ENSRegistry");

    //deploy ENS Registry
    const deployedENSRegistry = await ENSRegistry.deploy();
    await deployedENSRegistry.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { ENSRegistry, deployedENSRegistry, owner, addr1, addr2 };
  }

  it("ENSRegistry should be successfully deployed, account0 should be the owner of the Record[0x0]", async function () {
    const { deployedENSRegistry, owner } = await loadFixture(
      deployENSRegistryFixture
    );
    expect(await deployedENSRegistry.recordExists(ZERO_ADDRESS)).to.equal(true);
  });
});
