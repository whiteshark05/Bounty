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
      <Route path='/user' component={User}/>}/>
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
    solutionIDs:null,
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
    this.setState(Object.assign({},this.state,{problemCount:count, account: { address: address, balance: balance}}),() => console.log(this.state.account));
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
    if (index === count-1)
      nextIndex = count-1;
    else
      nextIndex = index+1;
    this.onClickGet(nextIndex);
  }

  onClickPrev = () => {
    let index = this.state.index;
    let nextIndex = 0;
    if (index === 0)
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
    var a=[];
    for (let i=0; i<count; i++){
      if(bountyContract.getProblemSetterAddress(i)===address)
      a.push(i);
    }
    this.setState({...this.state,problems:a})
    this.setState(Object.assign({},this.state,{problemCount:count, problems:a, account: { address: address, balance: balance}}),() => console.log(this.state));
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
        <DisplayUserInfo account = {this.state.account} accountID = {this.state.accountID}/>
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
    let setterAddress = accounts[obj.accountID];
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



