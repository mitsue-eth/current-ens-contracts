const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const namehash = require("eth-ens-namehash");
const sha3 = require("js-sha3").keccak_256;
const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const nodeMitsue = namehash.hash("mitsue");
console.log("Nodemitsue: ", nodeMitsue);
// const nodeZeroAddress = namehash.hash(ZERO_ADDRESS);

const labelMitsue = "0x" + sha3("mitsue");
// console.log("Keccak 256 of Mitsue", label);

describe("ENS Registry Deployment Tests", function () {
  async function deployENSRegistryFixture() {
    // Get the ContractFactory and Signers here.
    const [addr0, addr1, addr2] = await ethers.getSigners();
    const ENSRegistry = await ethers.getContractFactory("ENSRegistry");

    //deploy ENS Registry
    const deployedENSRegistry = await ENSRegistry.deploy();
    await deployedENSRegistry.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { ENSRegistry, deployedENSRegistry, addr0, addr1, addr2 };
  }

  it("Records[0x0] should exist, owner to be account0", async function () {
    const { deployedENSRegistry, addr0 } = await loadFixture(
      deployENSRegistryFixture
    );
    expect(await deployedENSRegistry.recordExists(ZERO_ADDRESS)).to.equal(true);
    expect(await deployedENSRegistry.owner(ZERO_ADDRESS)).to.equal(
      addr0.address
    );
  });

  it("Mitsue record should not exist initially, but to exist after registration of subnode", async function () {
    //1. Checks that mitsue subnode of 0x0 does not exist
    //2. Addr0 create mitsue subnode and assisn Addr1 as new owner
    //3. Test checks that now mitsue node exist
    //4. Test checks that the owner of this node is Addr1
    //5. Test tries to reassign the owner of mitsue from Addr0 to Addr2 - should fail
    //6. Test tries to reassign the owner of mitsue from Addr1 to Addr2 - should execute and Emit event
    //7. Test checks that the owner of mitsue node is Addr2

    const { deployedENSRegistry, addr0, addr1, addr2 } = await loadFixture(
      deployENSRegistryFixture
    );
    expect(await deployedENSRegistry.recordExists(nodeMitsue)).to.equal(false);

    //2
    let tx = await deployedENSRegistry.setSubnodeOwner(
      ZERO_ADDRESS,
      labelMitsue,
      addr1.address,
      { from: addr0.address }
    );
    tx.wait();

    //3
    expect(await deployedENSRegistry.recordExists(nodeMitsue)).to.equal(true);
    //4
    expect(await deployedENSRegistry.owner(nodeMitsue)).to.equal(addr1.address);

    //5
    await expect(
      deployedENSRegistry.setOwner(nodeMitsue, addr2.address, {
        from: addr0.address,
      })
    ).to.be.reverted;

    //6 Try to change the owner from Addr1 - should emit Transfer event
    await expect(
      deployedENSRegistry.connect(addr1).setOwner(nodeMitsue, addr2.address)
    )
      .to.emit(deployedENSRegistry, "Transfer")
      .withArgs(nodeMitsue, addr2.address);

    //7
    expect(await deployedENSRegistry.owner(nodeMitsue)).to.equal(addr2.address);
  });
});
