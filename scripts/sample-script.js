const hre = require("hardhat");

async function main() {
  const EphereERC721Fact = await hre.ethers.getContractFactory(
    "EphereFootballerERC721"
  );
  const EphereERC721 = await EphereERC721Fact.deploy(200);

  await EphereERC721.deployed();
  console.log("EphereERC721 deployed to:", EphereERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
