import Web3 from 'web3';
// var ganache = require("ganache-cli");
// web3.setProvider(ganache.provider());
// const fs = require('fs');

// fs.readFile('C:/User/Thinh/Solidity/FYP/contracts/Bounty.json', (err, data) => {  
//     if (err) throw err;
//     let bountyABI = data.abi;
//     console.log(bountyABI);
// });

const bountyABI = [
  {
    "inputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "name_",
        "type": "string"
      },
      {
        "name": "description_",
        "type": "string"
      },
      {
        "name": "input_",
        "type": "string"
      },
      {
        "name": "output_",
        "type": "string"
      }
    ],
    "name": "createProblem",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getProblemCount",
    "outputs": [
      {
        "name": "problemCount",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      }
    ],
    "name": "getProblemSetterAddress",
    "outputs": [
      {
        "name": "setterAddress_",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      }
    ],
    "name": "getProblem",
    "outputs": [
      {
        "name": "setterAddress",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "description",
        "type": "string"
      },
      {
        "name": "input",
        "type": "string"
      },
      {
        "name": "output",
        "type": "string"
      },
      {
        "name": "priceTag",
        "type": "uint256"
      },
      {
        "name": "isActive",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      },
      {
        "name": "name_",
        "type": "string"
      }
    ],
    "name": "updateProblemName",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      },
      {
        "name": "description_",
        "type": "string"
      }
    ],
    "name": "updateProblemDescription",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      },
      {
        "name": "input_",
        "type": "string"
      }
    ],
    "name": "updateProblemInput",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      },
      {
        "name": "output_",
        "type": "string"
      }
    ],
    "name": "updateProblemOutput",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      }
    ],
    "name": "updateProblemPriceTag",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      }
    ],
    "name": "removeProblem",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id_",
        "type": "uint256"
      },
      {
        "name": "content_",
        "type": "string"
      },
      {
        "name": "output_",
        "type": "string"
      }
    ],
    "name": "createSolution",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getSolutionCount",
    "outputs": [
      {
        "name": "solutionCount",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "problemID_",
        "type": "uint256"
      }
    ],
    "name": "getSolutionIDsByProblemID",
    "outputs": [
      {
        "name": "solutionIDs_",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "solutionID_",
        "type": "uint256"
      }
    ],
    "name": "getSolutionBySolutionID",
    "outputs": [
      {
        "name": "solverAddress",
        "type": "address"
      },
      {
        "name": "problemID",
        "type": "uint256"
      },
      {
        "name": "content",
        "type": "string"
      },
      {
        "name": "output",
        "type": "string"
      },
      {
        "name": "isCorrect",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "solutionID_",
        "type": "uint256"
      }
    ],
    "name": "getProblemSolverAddress",
    "outputs": [
      {
        "name": "solverAddress_",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "problemID_",
        "type": "uint256"
      },
      {
        "name": "amount_",
        "type": "uint256"
      },
      {
        "name": "solutionID_",
        "type": "uint256"
      }
    ],
    "name": "transferRewards",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  }
]
const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
//console.log(bountyJSON)

let bountyAddress='0x14747acf60327005708db7a34b54082d54900c22';

web3.eth.defaultAccount = web3.eth.accounts[0]
const bountyContract=web3.eth.contract(bountyABI).at(bountyAddress);
const accounts=web3.eth.accounts;
export {bountyContract,accounts};