const { ethers } = require("hardhat");

async function main() {
  //general information about deployment into Hardhat network
  const [deployer] = await ethers.getSigners();
  const signers = await ethers.getSigners();
  for (i = 0; i < signers.length; i++) {
    console.log(`Signer ${i + 1} address:`, signers[i].address);
    console.log(
      `Signer ${i + 1}: balance`,
      (await signers[i].getBalance()).toString()
    );
  }

  //Deploy ENS registry and resolver
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const ENSRegistry = await ethers.getContractFactory("ENSRegistry");
  const deployedENSRegistry = await ENSRegistry.deploy();
  await deployedENSRegistry.deployed();

  const PublicResolver = await ethers.getContractFactory("PublicResolver");

  console.log(
    "ENS Registry deployed to the following address: ",
    deployedENSRegistry.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
