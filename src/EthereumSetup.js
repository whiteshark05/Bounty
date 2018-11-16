import Web3 from 'web3';
const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

const bountyABI = require("./contracts/Bounty.json").abi
let bountyAddress="0x278Ee2392150D06Af782159F92e616da390081f5";

web3.eth.defaultAccount = web3.eth.accounts[0]
const bountyContract=web3.eth.contract(bountyABI).at(bountyAddress);
const accounts=web3.eth.accounts;
export {bountyContract,accounts};