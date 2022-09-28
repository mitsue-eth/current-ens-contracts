const ethers = require("ethers");
const BigNumber = ethers.BigNumber;
const utils = ethers.utils;
const namehash = require("@ensdomains/eth-ens-namehash");

const stringToNormalize = "MITsue.eth";
const stringToNamehash = "0";
const labelForTokenId = "0";

//normalize NameHash
const normalized = namehash.normalize(stringToNormalize);
const hash1 = namehash.hash(normalized);
console.log(`Normalized namehash of ${stringToNormalize}: `, hash1);

//calculate Namehash
const hash = namehash.hash(stringToNamehash);
console.log(`Namehash of ${stringToNamehash}:`, hash);

//calculate TokenId from its label
const labelHash = utils.keccak256(utils.toUtf8Bytes(labelForTokenId));
const tokenId = BigNumber.from(labelHash).toString();
console.log(`TokenID for label ${labelForTokenId}:`, tokenId);
