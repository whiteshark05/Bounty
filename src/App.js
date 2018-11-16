import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import{bountyContract,accounts} from './EthereumSetup'
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import {Form, Field} from 'simple-react-forms';
import Web3 from 'web3';
import {DisplayAllProblems} from './Components/DisplayAllProblems.js'
import {DisplayAllSolutions} from './Components/DisplayAllSolutions.js'
import {DisplayUserInfo} from './Components/DisplayUserInfo.js'
import {SendRewards} from './Components/SendRewards.js'
import Table from 'react-toolbox/lib/table';

const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

class App extends Component {

  constructor () {
    super()
    this.state = {accountID: 0}
  }

  setAccountID = val => {
    this.setState({accountID:val});
  }

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
          <p>Current Account No: {this.state.accountID}</p>
          <MainRouter accountID = {this.state.accountID} setAccountID = {this.setAccountID}/>
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

const MainRouter = ({accountID,setAccountID}) => (
  
  <main>
    <Switch>
      <Route exact path='/' component={() => <Home accountID = {accountID} setAccountID = {setAccountID}/>}/>
      <Route path='/problem' component={() => <ProblemRouter accountID = {accountID}/>}/>
      <Route path='/user'component={() => <User accountID = {accountID}/>}/>
    </Switch>
  </main>
)

const ProblemRouter = ({accountID}) => (
  <Switch>
    <Route exact path='/problem' component={() => <ProblemSet accountID = {accountID}/>}/>
    <Route exact path='/problem/new' component={() => <PForm accountID = {accountID}/>}/>
  </Switch>
)

//set up account 
const Home = ({accountID,setAccountID}) => {
  const array = [0,1,2,3,4,5];
  return (
    <div>
      <h1>Select Your Account</h1>
      {
          array.map((i,k) => accountID===i?
          <button key={k} onClick = {() => setAccountID(i)}>{i}</button>
          :<button key ={k} onClick = {() => setAccountID(i)}>{i}</button>)
      }
    </div>
  )
}



class ProblemSet extends Component {
  constructor(props){
    super(props)
    this. state = {
      index:0,
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
      solutionIDs:null,
      solutions:[],
  
      account: 
      {
        address:null,
        balance:null,
      },
    }
  }
   

   componentDidMount(){
    let count = bountyContract.getProblemCount().toNumber() 
    let address = accounts[this.props.accountID];
    let balance = web3.eth.getBalance(address).toNumber()/Math.pow(10,18)
    this.setState(Object.assign({},this.state,{problemCount:count, account: { address: address, balance: balance}}),() => console.log(this.state.account));
    if(count!=0){
      this.onClickGet(this.state.index)
    }
  }

  onClickGet = (index) => {
    let count= bountyContract.getProblemCount().toNumber() 
    let p = bountyContract.getProblem(index);
    let sID = bountyContract.getSolutionIDsByProblemID(index).map(i => i.toNumber())
    let solutions = [];
    sID.forEach(i => {
      let s = bountyContract.getSolutionBySolutionID(i);
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
        solutionIDs: sID,
        solutions: solutions,

        searchBox: null,
      }
  ))
  } 

  onClickCreate = () => {

    bountyContract.createProblem("Problem 3", "Nagato", 10, 0, {from:accounts[1], value:100000000000000000,gas:3000000})
    this.onClickGet()
  }

  onClickNext = () => {
    let count= bountyContract.getProblemCount().toNumber() 
    //console.log("Index", this.state.index)
    let index = this.state.index;
    let nextIndex = 0;
    if(count === 0)
      return;
    else if (index === count-1)
      nextIndex = count-1;
    else
      nextIndex = index+1;
    this.onClickGet(nextIndex);
  }

  onClickPrev = () => {
    let index = this.state.index;
    let nextIndex = 0;
    if (index === 0)
      return;
    else
      nextIndex=index-1;
    this.onClickGet(nextIndex);
  }


  onClickHandleSearch = () => {
    let index = this.state.searchBox;
    this.onClickGet(index);
  }

  render() {
    return (
      <div>
        <div className='searchboxstyle'>
          <input
          type = 'text'
          placeholder = 'search'
          value = {this.state.searchBox}
          onChange = {e => this.setState({...this.state, searchBox: e.target.value})}
          />
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
          <DisplayAllSolutions solutions = {this.state.solutions} solutionIDs = {this.state.solutionIDs}/>
          <CreateSolution problemID = {this.state.index}/>
        </div>
        <div>
        
        </div>
    </div> 
    );
  }
}



class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      index:null,
      problemCount:null,
      problem:{
      setterAddress:"",
      name:"",
      description:"",
      input:"",
      output:"",
      priceTag:null,
      isActive:true
      },
      problems:[],
  
      solutionIDs:[],
      solutionCount:null,
      solution:{
        solverAddress:"",
        problemID:null,
        content:"",
        output:null,
        isCorrect:null,
      },
      solutions:[],
  
      account: 
      {
        address:null,
        balance:null,
      },
    }
  }
  

  componentDidMount(){
    this.getUserInfo(this.props.accountID) 
    console.log(this.props)
  }
  
  // Get user address and balance (default is user 0)
  getUserInfo = (accountID) => {
    let count = bountyContract.getProblemCount().toNumber() 
    let address = accounts[accountID];
    let balance = web3.eth.getBalance(address).toNumber()/Math.pow(10,18)
    var a=[];
    for (let i=0; i<count; i++){
      if(bountyContract.getProblemSetterAddress(i)===address)
      a.push(i);
    }
    this.setState({...this.state,problems:a})
    this.setState(Object.assign({},this.state,{accountID:accountID, problemCount:count, problems:a, account: { address: address, balance: balance}}),() => console.log(this.state));
  }

  // Get Problems and Solutions created by this account
  // Get all Soulutions submitted to this problem
  onClickGet = (index) => {
    let count= bountyContract.getProblemCount().toNumber() 
    let p = bountyContract.getProblem(index);
    let sID = bountyContract.getSolutionIDsByProblemID(index).map(i => i.toNumber())
    let solutions = [];
    sID.forEach(i => {
      let s = bountyContract.getSolutionBySolutionID(i);
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
    console.log(sID);
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
        solutionIDs: sID,
        solutions: solutions,
      }
    ))
    
  } 

  display = (index) => {
    this.onClickGet(index);
  }

  transfer = (amount,solutionID) => {
    console.log("USer", this.state.index, amount, solutionID)
    bountyContract.transferRewards(this.state.index, amount, solutionID)
    this.onClickGet(this.state.index);
    this.accountLogger();
  }

  accountLogger = () => {
    for(let i=0; i<10; i++) 
      console.log(`account ${i}:`,web3.eth.getBalance(accounts[i]).toNumber()/Math.pow(10,18))
    
  }
  render() {
  return (
    <div>
      <div>
        <DisplayUserInfo account = {this.state.account} accountID = {this.props.accountID}/>
      </div>
      <div>
        <h3>All Problems Created By This Account</h3>
        {this.state.problems.map((i,key) => <button key={key} onClick={()=>this.display(i)}>{i}</button>)}
      </div>
      <div>
        <DisplayAllProblems problem={this.state.problem} index={this.state.index} problemCount={this.state.problemCount}/>
      </div>
      <div>
        <SendRewards transfer = {this.transfer} problem = {this.state.problem} solutions = {this.state.solutions} solutionIDs = {this.state.solutionIDs}/>
      </div>
    </div>

  )
  }
}

class PForm extends Component {
  onClickHandler () {
    // The format is iffy
    console.log("Form", this.refs['simpleForm'].getFormValues());
    let obj = this.refs['simpleForm'].getFormValues();
    let setterAddress = accounts[this.props.accountID];
    let name = obj.name;
    let description = obj.description;
    let input = obj.input;
    let output = obj.output;
    let priceTag = obj.priceTag*Math.pow(10,18);
    bountyContract.createProblem(name, description, input, output, {from:setterAddress, value:priceTag, gas:3000000})
  }

  render () {
    return (
    <div className='pform'>
      <Form ref='simpleForm' >
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
            label='Price Tag (Eth)'
            type='text'
          />
      </Form>
      <Link to='/problem'><button onClick={this.onClickHandler.bind(this)}>Submit</button></Link>
      <Link to='/problem'><button>Back</button></Link>
    </div>

    );
  }
}




class CreateSolution extends Component {
  constructor(){
    super()
    this.state = {solutionBox: ''}
  }

  onClickCreateSolution = props => {
    let problemID = this.props.problemID;
    let content = this.state.solutionBox;
    let output = "1234";
    bountyContract.createSolution(problemID,content,output,{from:accounts[1],gas:3000000});
  }

  
  render() {
    return (
      <div className = 'pform'>
        
        <textarea 
        rows = "20"
        cols = "150"
        type = "text"
        placeholder = "Enter your solution here"
        value = {this.state.solutionBox}
        onChange = {e => this.setState({...this.state, solutionBox: e.target.value})}
        />
        <br/>
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



