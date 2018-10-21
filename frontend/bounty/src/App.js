import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import{bountyContract,accounts} from './EthereumSetup'
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { cpus } from 'os';
import {Form, Field} from 'simple-react-forms';
import Web3 from 'web3';
const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>A Bounty Contract</h2>  
        </header>
        <div>
          <Main/>
          <MainRouter/>
        </div>
      </div>
      </BrowserRouter> 
    )
  }
}


export default App;


const Main = () => (
  <header className="navheader">
    <nav>
      <ul>
        <li className="l1"><Link to='/'>Home</Link></li>
        <li><Link to='/problem'>Problems</Link></li>
        <li><Link to='/user'>User</Link></li>
      </ul>
    </nav>
  </header>
)

const MainRouter = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/problem' component={ProblemRouter}/>
      <Route path='/user' component={User}/>
    </Switch>
  </main>
)

const ProblemRouter = () => (
  <Switch>
    <Route exact path='/problem' component={ProblemSet}/>
    <Route exact path='/problem/new' component={PForm}/>
  </Switch>
)

const Home = () => (
  <h1>This is a home page</h1>
)

class ProblemSet extends Component {
  state = {
    index:null,
    problemCount:null,
    problem:{
    setterAddress:"",
    name:"",
    description:"",
    input:null,
    output:null,
    priceTag:null,
    isActive:true
    },
    problems:[],
    solutionCount:null,
    solution:{
      solverAddress:"",
      problemID:null,
      content:"",
      output:null,
      isCorrect:null,
    },
    solutions:[],
    accountID:0,
    account: 
    {
      address:null,
      balance:null,
    },
}
  
   componentDidMount(){
    let count = bountyContract.getProblemCount().toNumber() 
    let address = accounts[this.state.accountID];
    let balance = web3.eth.getBalance(address).toNumber()/Math.pow(10,18)
    this.setState(Object.assign({},this.state,{problemCount:count, account: { address: address, balance: balance}}));
  }

  onClickGet = (index) => {
    let count= bountyContract.getProblemCount().toNumber() 
    let p = bountyContract.getProblem(index);
    //console.log("before", this.state.index);
    //console.log("Problem", p);
    let sID = bountyContract.getSolutionIDsByProblemID(index).map(i => i.toNumber())
    //console.log("SolutionIDs", sID);
    let solutions = [];
    sID.forEach(i => {
      let s = bountyContract.getSolutionBySolutionID(i);
      //console.log(s);
      let o = 
      {
        solverAddress: s[0],
        problemID: s[1].toNumber(),
        content: s[2],
        output: s[3],
        isCorrect: s[4],
      };
      solutions.push(o);
    })
    //console.log(solutions);

    this.setState(Object.assign({},this.state,
      {
        problemCount: count,
        index: index,
        problem:{
        setterAddress: p[0],
        name: p[1],
        description: p[2],
        input: p[3],
        output: p[4],
        priceTag: p[5].toNumber()/Math.pow(10,18),
        isActive: p[6],
        },
        solutions: solutions,
      }
  ))
    //console.log("after", this.state.problemCount);
  } 

  onClickCreate = () => {

    bountyContract.createProblem("Problem 3", "Nagato", 10, 0, {from:accounts[1], value:100000000000000000,gas:3000000})
    this.onClickGet()
  }

  onClickNext = () => {
    let count= bountyContract.getProblemCount().toNumber() 
    console.log("Index", this.state.index)
    let index = this.state.index;
    let nextIndex = 0;
    if (index == count-1)
      nextIndex = count-1;
    else
      nextIndex = index+1;
    this.onClickGet(nextIndex);
  }

  onClickPrev = () => {
    let index = this.state.index;
    let nextIndex = 0;
    if (index==0)
      nextIndex=0;
    else
      nextIndex=index-1;
    this.onClickGet(nextIndex);
  }


  onClickHandleSearch = () => {
    //let count= bountyContract.getProblemCount().toNumber()
    let index = this.refs['searchbox'].getFormValues().problemID;
    //console.log("Search Index", index); 
    this.onClickGet(index);
    //console.log("Current Index", this.state.index)
  }

  render() {
    return (
      <div>
        <div className='searchboxstyle'>
          <Form ref='searchbox' >
            <Field
            name='problemID'
            label= 'problemID' 
            type='text'
            />
          </Form>
          <button onClick = {this.onClickHandleSearch}>Search</button>
        </div>
        <div>
          <DisplayAllProblems problem={this.state.problem} index={this.state.index} problemCount={this.state.problemCount}/>
        </div>
        <div>
          <button onClick={this.onClickPrev}>Prev</button>
          <button onClick={this.onClickNext}>Next</button>
        </div>
        <div>
          <Link to='/problem/new'><button>New Problem</button></Link>
          <DisplayAllSolutions solutions = {this.state.solutions}/>
          <CreateSolution problemID = {this.state.index}/>
          <DisplayUserInfo account = {this.state.account} accountID = {this.state.accountID}/>
        </div>
        <div>
        
        </div>
    </div> 
    );
  }
}

const DisplayUserInfo = props => {
  return (
    <div className = "user-info-table">
    <h3>Account information</h3>
    <table className = 'center'>
      <tbody>
        <tr>
          <th>Account ID</th>
          <td>{props.accountID}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>{props.account.address}</td>
        </tr>
        <tr>
          <th>Balance(Eth)</th>
          <td>{props.account.balance}</td>
        </tr>
      </tbody>
    </table>
    </div>
  )
}

const User = () => (
  <h2>Display All Problems and Solutions created by this Address</h2>
)


const DisplayAllProblems = props => {
  return (
    <table className="center">
      <tbody>
        <tr>
          <th>Total Problems</th>
          <td>{props.problemCount}</td>
        </tr>
        <tr>
          <th>Problem ID</th>
          <td>{props.index}</td>
        </tr>
        <tr>
          <th>Problem Setter Address</th>
          <td>{props.problem.setterAddress}</td>
        </tr>
        <tr>
          <th>Tittle</th>
          <td>{props.problem.name}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{props.problem.description}</td>
        </tr>
        <tr>
          <th>Input</th>
          <td>{props.problem.input}</td>
        </tr>
        <tr>
          <th>Output</th>
          <td>{props.problem.output}</td>
        </tr>
        <tr>
          <th>Price Tag(Eth)</th>
          <td>{props.problem.priceTag}</td>
        </tr>
      </tbody>
    </table>
  )
}

class PForm extends Component {
  onClickHandler () {
    // The format is iffy
    console.log("Form", this.refs['simpleForm'].getFormValues());
    let obj = this.refs['simpleForm'].getFormValues();
    let setterAddress = accounts[obj.accountID];
    let name = obj.name;
    let description = obj.description;
    let input = obj.input;
    let output = obj.output;
    let priceTag = obj.priceTag;
    bountyContract.createProblem(name, description, input, output, {from:setterAddress, value:priceTag, gas:3000000})
  }

  render () {
    return (
    <div className='pform'>
      <Form ref='simpleForm' >
          <Field
            name='accountID'
            label='AccountID' 
            type='text'
          />
          <Field
            name='name'
            label='Tittle' 
            type='text'
          />
          <Field className = 'pform-description'
            name='description'
            label='Description'
            type='text'
          />
          <Field
            name='input'
            label='Input'
            type='text'
          />
          <Field
            name='output'
            label='Output'
            type='text'
          />  
          <Field
            name='priceTag'
            label='Price Tag (Wei)'
            type='text'
          />
      </Form>
      <Link to='/problem'><button onClick={this.onClickHandler.bind(this)}>Submit</button></Link>
      <Link to='/problem'><button>Back</button></Link>
    </div>

    );
  }
}


const DisplayAllSolutions = props => {
  return (
    <div>
      <h3>Solutions</h3>
      {props.solutions.slice(0).reverse().map((i,key) => {
        return (
          <div key={key}>
            <table className = 'center'>
              <tbody>
                <tr>
                  <th>Problem ID</th>
                  <td>{i.problemID}</td>
                </tr>
                  <tr>
                    <th>solverAddress</th>
                    <td>{i.solverAddress}</td>
                  </tr>
                  <tr>
                    <th>Content</th>
                    <td>{i.content}</td>
                  </tr>
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}


class CreateSolution extends Component {

  onClickCreateSolution = props => {
    let problemID = this.props.problemID;
    let content = this.refs['search'].getFormValues().content;
    //let output = this.refs['search'].getFormValues().output;
    let output = "1234";
    bountyContract.createSolution(problemID,content,output,{from:accounts[2],gas:3000000});
  }

  render() {
    return (
      <div className = 'pform'>
        
        <Form ref='search' >
          <Field
          name='content'
          label= 'New Solution' 
          type='text'
          />
        </Form>
        <Link to='/problem'><button onClick={this.onClickCreateSolution}>Submit</button></Link>
      </div>
    )
    
  }
}



// class SwitchAccount extends Component {
//   constructor(props){
//     super(props)
//   }
//   onHandleAccount(event){
//     let val = event.dataset.message;
//     console.log("val", val)
//     this.props.sendData(val);
//   }

//   render (){
//     return (
//     <div>
//       <button onClick={this.onHandleAccount} data-message="0">Account 0</button>
//       <button onClick={this.onHandleAccount} value="1">Account 1</button>
//       <button onClick={this.onHandleAccount} value="2">Account 2</button>
//     </div>
//     )
//   }
// }



