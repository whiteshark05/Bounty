import React, { Component } from 'react'
import {Form, Field} from 'simple-react-forms';
import { DisplayAllSolutions } from "./DisplayAllSolutions";

export class SendRewards extends Component {
   
    onClickHandle = (props) => {
        let amount = this.refs['simpleForm'].getFormValues().amount*Math.pow(10,18);
        let solutionID = this.refs['simpleForm'].getFormValues().solutionID;
        console.log(amount,solutionID);
        this.props.transfer(amount,solutionID);
    }   

    render() {
        return (
            <div>
                <div>
                    <DisplayAllSolutions solutions = {this.props.solutions} solutionIDs = {this.props.solutionIDs}/>
                 </div>
                <div className='pform'>
                    <Form ref='simpleForm' >
                        <Field
                            name='solutionID'
                            label='solutionID' 
                            type='text'
                        />
                        <Field
                            name='amount'
                            label='amount' 
                            type='text'
                        />
                    </Form>
                <button onClick={this.onClickHandle}>Transfer</button>
                </div>
            </div>
        )
    }
    
}

