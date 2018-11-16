// Allows us to use ES6 in our migrations and tests.
//require('babel-register')

var HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();
var mnemonic = process.env.MNEMONIC;
var infuraToken = process.env.INFURA_TOKEN;

module.exports = {
  networks: {
    development: {
    host: '127.0.0.1',
    port: 7545,
    network_id: '5777' // Match any network id
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraToken}`),
      network_id: '3',
      gas: 4500000,
      //from: '0x823eDA0E2414a90F00489BE8065bBB11d93f6972'
    }
  }
};
