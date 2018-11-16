import React from 'react'

export const DisplayAllSolutions = ({solutions, solutionIDs}) => {
    let mergedSolutions =solutions.map((item,key) => Object.assign({},item,{solutionID:solutionIDs[key]}));
    if(solutions.length ===0) 
    return (<h3>No Active Solution</h3>);
    else
    return (
      <div>
        <h3>Solutions</h3>
        {mergedSolutions.slice(0).reverse().map((i,key) => {
          return (
            <div key={key}>
              <table className = 'center'>
                <tbody>
                  <tr>
                    <th>Solution ID</th>
                    <td>{i.solutionID}</td>
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