const ethers = require("ethers");
const BigNumber = ethers.BigNumber;
const gr = require("graphql-request");
const { request, gql } = gr;
const tokenId =
  "89383917151549425344489934841543176794137839496053407200866830346354774134153";
// Should return 0x8289cbbdf36288f8d1cd551fc631dcec93336e5be007ad761a7e810c96669909
const labelHash = BigNumber.from(tokenId).toHexString();

const url = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
const GET_LABEL_NAME = gql`
query{
  domains(first:3, where:{labelhash:"${labelHash}"}){
    labelName
  }
}`;

request(url, GET_LABEL_NAME).then((data) => console.log(data));
// { domains: [ { labelName: 'vitalik' } ] }
